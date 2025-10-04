import { QueryFunction, useQuery } from '@tanstack/react-query';

import { fetchShiftsSummary, ShiftSummary } from '@/services/shifts-calendar';
import { TIME } from '@/queries/gc-time.enum';

export const SHIFTS_SUMMARY_QUERY_KEY = 'shifts_summary_query';

export type ShiftsSummaryQueryParams = {
  fromDate: string;
  toDate: string;
  categoryFilter?: string[];
  unitFilter?: string[];
};

export const getShiftsSummaryQueryKey = (params: ShiftsSummaryQueryParams) => [
  SHIFTS_SUMMARY_QUERY_KEY,
  params.fromDate,
  params.toDate,
  params.categoryFilter,
  params.unitFilter,
];

export const queryFnShiftsSummary: QueryFunction<
  ShiftSummary[],
  unknown[]
> = async ({ queryKey }) => {
  const [, fromDate, toDate, categoryFilter, unitFilter] = queryKey;

  const response = await fetchShiftsSummary(
    fromDate as string,
    toDate as string,
    categoryFilter as string[],
    unitFilter as string[]
  );

  return response;
};

export const useShiftsSummary = (params: ShiftsSummaryQueryParams) => {
  return useQuery({
    queryKey: getShiftsSummaryQueryKey(params),
    queryFn: queryFnShiftsSummary,
    gcTime: TIME['5_minutes'],
    staleTime: TIME['1_minute'],
    enabled: !!params.fromDate && !!params.toDate,
  });
};
