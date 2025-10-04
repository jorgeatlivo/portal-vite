import { useMemo } from 'react';

import { PortalProfessionalSearchVo } from '@/services/professionals';
import { useInfinitePaginatedShiftList } from '@/queries/paginated-shift-list';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';

import { Filter } from '@/types/common/shiftFilters';

export default function useFetchPaginatedShiftList(
  appliedFilter: string,
  appliedSort: SortingOptionsEnum,
  day: string,
  selectedProfessionals?: PortalProfessionalSearchVo[],
  filters?: Filter[],
  size: number = 30
) {
  const professionalIds = useMemo(
    () => selectedProfessionals?.map((p) => p.id.toString()) || [],
    [selectedProfessionals]
  );

  const units = useMemo(() => {
    const unitFilter = filters?.find((f) => f.key === 'unit');
    return (
      unitFilter?.appliedOptions.map((option) =>
        'value' in option ? option.value : option.code
      ) || []
    );
  }, [filters]);

  const {
    isLoading,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    error,
  } = useInfinitePaginatedShiftList({
    size,
    fromDate: day,
    filterId: appliedFilter,
    sortBy: appliedSort,
    professionalIds,
    units,
  });

  const flattenedShifts =
    data?.pages.flatMap((page) => page.shiftsByDate) || [];
  const totalShifts = data?.pages[0]?.totalShifts || 0;

  return {
    isLoading,
    listResponse: flattenedShifts,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalShifts,
    pagination: {
      currentPage: data?.pages[data.pages.length - 1]?.page || 1,
      hasNextPage: !!hasNextPage,
    },
  };
}
