import { fetchShifts } from '@/services/shifts-calendar';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';
import { FILTER_CONFIGURATIONS } from '@/components/shiftlist/FiltersRow';

export const SHIFT_LIST_QUERY_KEY = 'shift_list_query';

export const queryFnShiftList = async ({
  queryKey,
}: {
  queryKey: unknown[];
}) => {
  try {
    const [, day, appliedFilter, appliedSort, professionalIds] = queryKey;

    const filterConfiguration = FILTER_CONFIGURATIONS.find(
      (filter) => filter.id === appliedFilter
    );

    const response = await fetchShifts(
      day as string,
      undefined,
      'ASC',
      filterConfiguration?.configuration,
      appliedSort as SortingOptionsEnum,
      professionalIds as string[]
    );
    return response;
  } catch (error) {}
};
