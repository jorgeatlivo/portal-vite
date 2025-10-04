import { useCallback, useMemo, useState } from 'react';

import { uniqBy } from 'lodash-es';

import { UseSearchableDataReturn } from '@/components/form/FormSearchableAutocomplete';

import {
  ShiftInvitationConfig,
  ShiftInvitationProfessional,
  ShiftInvitationSearch,
} from '@/types/shift-invitation';

import { useFetchShiftInvitation } from '@/pages/shared/ShiftForm/hooks/useShiftMutation';
import { ProfessionalOption } from '@/pages/shared/ShiftForm/types/form';

// Helper to deduplicate professionals and transform to options
export const getUniqueProfessionalOptions = (
  profs: ShiftInvitationProfessional[]
): ProfessionalOption[] => {
  const options: ProfessionalOption[] = profs.map((professional) => ({
    value: professional.id,
    label: professional.name,
    original: professional,
  }));
  return uniqBy(options, (o) => o.value);
};

// Transform professional data to match BaseOption interface

// Hook to adapt useFetchShiftInvitation for FormSearchableAutocomplete
export function useShiftInvitationAutocomplete(
  shiftConfig?: ShiftInvitationConfig,
  initialSearch?: Omit<ShiftInvitationSearch, 'name'>,
  size: number = 20,
  enabled: boolean = true,
  uniqueKey?: string // Add unique key to differentiate between multiple instances
): UseSearchableDataReturn<ProfessionalOption> & {
  onSearch: (searchTerm: string | undefined) => void;
} {
  const [search, setSearch] = useState<ShiftInvitationSearch>({
    name: undefined,
    selectedProfessionalIds:
      initialSearch?.selectedProfessionalIds || undefined,
  });

  // Update search when initialSearch changes (selectedProfessionalIds)
  const searchWithUpdatedIds = useMemo(
    () => ({
      name: search.name,
      selectedProfessionalIds:
        initialSearch?.selectedProfessionalIds || undefined,
    }),
    [search.name, initialSearch?.selectedProfessionalIds]
  );

  const {
    professionals,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    totalCount,
  } = useFetchShiftInvitation(
    shiftConfig,
    searchWithUpdatedIds,
    size,
    enabled,
    uniqueKey
  );

  // Transform and deduplicate professionals to options
  const data = useMemo<ProfessionalOption[]>(() => {
    return getUniqueProfessionalOptions(professionals);
  }, [professionals]);

  // Search callback
  const onSearch = useCallback((searchTerm: string | undefined) => {
    setSearch((prev) => ({
      ...prev,
      name: searchTerm,
    }));
  }, []);

  return {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    totalCount,
    onSearch,
  };
}
