import { QueryFunction, useQuery } from '@tanstack/react-query';

import { fetchShifts } from '@/services/shifts-calendar';
import { TIME } from '@/queries/gc-time.enum';

export const CALENDAR_SHIFTS_QUERY_KEY = 'calendar_shifts_query';

export type CalendarShiftsQueryParams = {
  selectedDate: string;
  professionalIds?: string[];
};

export const getCalendarShiftsQueryKey = (
  params: CalendarShiftsQueryParams
) => [CALENDAR_SHIFTS_QUERY_KEY, params.selectedDate, params.professionalIds];

export const queryFnCalendarShifts: QueryFunction<any[], unknown[]> = async ({
  queryKey,
}) => {
  const [, selectedDate, professionalIds] = queryKey;

  const response = await fetchShifts(
    selectedDate as string,
    selectedDate as string,
    'ASC',
    {},
    undefined,
    professionalIds as string[]
  );

  return response;
};

export const useCalendarShifts = (params: CalendarShiftsQueryParams) => {
  return useQuery({
    queryKey: getCalendarShiftsQueryKey(params),
    queryFn: queryFnCalendarShifts,
    gcTime: TIME['5_minutes'],
    staleTime: TIME['1_minute'],
    enabled: !!params.selectedDate,
  });
};
