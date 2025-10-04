import { useMemo } from 'react';

import { useShiftsSummary } from '@/queries/shifts-summary';

import { Filter, getOptionToValue } from '@/types/common/shiftFilters';

export default function useFetchShiftsSummary(
  fromDate: string,
  toDate: string,
  filters?: Filter[]
) {
  const filtersApplied = useMemo(() => {
    return (
      filters?.reduce(
        (acc, filter) => {
          acc[filter.key] = filter.appliedOptions.map(getOptionToValue(filter));
          return acc;
        },
        {} as { [key: string]: string[] }
      ) || {}
    );
  }, [filters]);

  const categoryFilter = useMemo(
    () => filtersApplied['category'],
    [filtersApplied]
  );
  const unitFilter = useMemo(() => filtersApplied['unit'], [filtersApplied]);

  const { data, isLoading, error, refetch } = useShiftsSummary({
    fromDate,
    toDate,
    categoryFilter,
    unitFilter,
  });

  return {
    isLoading,
    shiftSummary: data || [],
    error,
    refetch,
  };
}
