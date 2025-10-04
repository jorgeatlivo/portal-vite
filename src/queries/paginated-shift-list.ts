import { QueryFunction, useInfiniteQuery } from '@tanstack/react-query';

import {
  fetchPaginatedShifts,
  PaginatedShiftsResponse,
} from '@/services/shifts-calendar';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';
import { FILTER_CONFIGURATIONS } from '@/components/shiftlist/FiltersRow';

export const PAGINATED_SHIFT_LIST_QUERY_KEY = 'paginated_shift_list_query';

export type PaginatedShiftListQueryParams = {
  page?: number;
  size?: number;
  fromDate?: string;
  toDate?: string;
  filterId?: string;
  sortBy?: SortingOptionsEnum;
  professionalIds?: string[];
  units?: string[];
};

export const getPaginatedShiftListQueryKey = (
  params: Omit<PaginatedShiftListQueryParams, 'page'>
) => [
  PAGINATED_SHIFT_LIST_QUERY_KEY,
  params.size,
  params.fromDate,
  params.toDate,
  params.filterId,
  params.sortBy,
  params.professionalIds,
  params.units,
];

type QueryFnParams = {
  queryKey: unknown[];
  pageParam?: number;
};

export const queryFnPaginatedShiftList: QueryFunction<
  PaginatedShiftsResponse,
  unknown[],
  number
> = async ({
  queryKey,
  pageParam = 1,
}: QueryFnParams): Promise<PaginatedShiftsResponse> => {
  const [
    ,
    size = 30,
    fromDate,
    toDate,
    filterId,
    sortBy,
    professionalIds,
    units,
  ] = queryKey;

  const filterConfiguration = FILTER_CONFIGURATIONS.find(
    (filter) => filter.id === filterId
  );

  const response = await fetchPaginatedShifts(
    pageParam,
    size as number,
    fromDate as string | undefined,
    toDate as string | undefined,
    'ASC',
    filterConfiguration?.configuration,
    sortBy as SortingOptionsEnum,
    professionalIds as string[],
    units as string[]
  );

  return response;
};

export const useInfinitePaginatedShiftList = (
  params: Omit<PaginatedShiftListQueryParams, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: getPaginatedShiftListQueryKey(params),
    queryFn: queryFnPaginatedShiftList,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage?.page) || 0;
      return lastPage?.finalPage ? undefined : page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      const page = Number(firstPage?.page) || 0;
      return page <= 1 ? undefined : page - 1;
    },
  });
};
