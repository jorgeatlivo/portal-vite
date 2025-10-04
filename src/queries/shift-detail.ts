import { fetchShiftDetails } from '@/services/shifts-calendar';

export const SHIFT_DETAIL_QUERY_KEY = 'shift_detail_query';

export const queryFnShiftDetail = async ({
  queryKey,
}: {
  queryKey: unknown[];
}) => {
  try {
    const [, selectedShiftId] = queryKey;

    const response = await fetchShiftDetails(selectedShiftId as number);
    return response;
  } catch (error) {}
};
