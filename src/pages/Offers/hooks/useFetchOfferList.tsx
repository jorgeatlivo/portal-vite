import { useQuery } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';
import { OFFER_LIST_QUERY_KEY, queryFnOfferList } from '@/queries/offer-list';

export default function useFetchOfferList() {
  const {
    isLoading,
    data: listResponse,
    error,
  } = useQuery({
    queryKey: [OFFER_LIST_QUERY_KEY],
    networkMode: 'online',
    refetchOnWindowFocus: false,
    staleTime: TIME['30_seconds'],
    gcTime: TIME['1_minute'],
    queryFn: queryFnOfferList,
  });

  return { isLoading, listResponse, error };
}
