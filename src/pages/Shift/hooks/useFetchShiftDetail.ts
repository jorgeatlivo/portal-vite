import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';
import {
  queryFnShiftDetail,
  SHIFT_DETAIL_QUERY_KEY,
} from '@/queries/shift-detail';

import { useInvalidateQuery } from '@/hooks/use-invalidate-query';
import { Shift } from '@/types/shifts';

export default function useFetchShiftDetail(
  selectedShiftId: number | undefined,
  initialData?: Shift
) {
  const {
    isLoading,
    data: shiftDetails,
    refetch,
    error,
  } = useQuery({
    queryKey: [SHIFT_DETAIL_QUERY_KEY, selectedShiftId],
    networkMode: 'online',
    staleTime: TIME['5_minutes'],
    gcTime: TIME['5_minutes'],
    queryFn: queryFnShiftDetail,
    enabled: Number.isFinite(selectedShiftId),
    // If initialData is provided we want it to act as a placeholder while
    // still letting the query fetch the latest data. React Query will skip
    // fetching if initialData is considered fresh (based on updatedAt), so
    // set initialDataUpdatedAt to a point in the past just beyond the
    // configured staleTime to mark it as stale immediately.
    initialData,
    initialDataUpdatedAt: initialData
      ? Date.now() - (Number(TIME['5_minutes']) + 1000)
      : undefined,
  });

  return { isLoading, shiftDetails, error, refetch };
}

export function useInvalidateQueryShiftDetail(
  selectedShiftId: number | undefined
) {
  const invalidateQuery = useInvalidateQuery();

  const invalidateShiftDetail = useCallback(() => {
    if (Number.isFinite(selectedShiftId)) {
      invalidateQuery([SHIFT_DETAIL_QUERY_KEY, selectedShiftId]);
    }
  }, [invalidateQuery, selectedShiftId]);

  return invalidateShiftDetail;
}
