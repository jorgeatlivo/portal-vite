import { useQuery } from '@tanstack/react-query';

import { CITIES_OFFER_QUERY_KEY, queryFnCities } from '@/queries/common';
import { TIME } from '@/queries/gc-time.enum';
export function useFetchCities() {
  const {
    isLoading,
    data: cities = [],
    error,
  } = useQuery({
    queryKey: [CITIES_OFFER_QUERY_KEY],
    networkMode: 'online',
    staleTime: TIME['1_minute'],
    gcTime: TIME['5_minutes'],
    queryFn: queryFnCities,
  });

  return { isLoading, cities, error };
}
