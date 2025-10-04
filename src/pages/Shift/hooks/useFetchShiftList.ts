import { useQuery } from '@tanstack/react-query';

import { PortalProfessionalSearchVo } from '@/services/professionals';
import { TIME } from '@/queries/gc-time.enum';
import { queryFnShiftList, SHIFT_LIST_QUERY_KEY } from '@/queries/shift-list';

export default function useFetchShiftList(
  appliedFilter: string,
  appliedSort: string,
  day: string,
  selectedProfessionals?: PortalProfessionalSearchVo[]
) {
  const professionalIds = selectedProfessionals?.map((p) => p.id);

  const {
    isLoading,
    data: listResponse,
    refetch,
    error,
  } = useQuery({
    queryKey: [
      SHIFT_LIST_QUERY_KEY,
      day,
      appliedFilter,
      appliedSort,
      professionalIds,
    ],
    networkMode: 'online',
    staleTime: TIME['5_minutes'],
    gcTime: TIME['5_minutes'],
    queryFn: queryFnShiftList,
    enabled: !!day,
  });

  return { isLoading, listResponse, error, refetch };
}
