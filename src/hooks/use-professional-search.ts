import { useEffect, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash-es';

import { PortalProfessionalSearchVo } from '@/services/professionals';
import { TIME } from '@/queries/gc-time.enum';
import {
  PROFESSIONAL_SEARCH_QUERY_KEY,
  queryFnProfessionalSearch,
} from '@/queries/professional-search';

export function useProfessionalSearch(searchTerm: string) {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  const debouncedSetValue = useMemo(
    () => debounce((value: string) => setDebouncedValue(value), 600),
    []
  );

  useEffect(() => {
    debouncedSetValue(searchTerm);
    return () => debouncedSetValue.cancel();
  }, [searchTerm, debouncedSetValue]);

  const { data = [], isLoading } = useQuery({
    queryKey: [PROFESSIONAL_SEARCH_QUERY_KEY, debouncedValue],
    queryFn: queryFnProfessionalSearch,
    enabled: !!debouncedValue && debouncedValue.length >= 2,
    gcTime: TIME['10_minutes'],
    staleTime: TIME['5_minutes'],
  });

  return { professionals: data as PortalProfessionalSearchVo[], isLoading };
}
