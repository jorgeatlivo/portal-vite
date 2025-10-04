import { useQuery } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';
import {
  OFFER_DETAIL_QUERY_ID,
  queryFnOfferDetail,
} from '@/queries/offer-detail';

export default function useFetchOfferDetail(offerId: string) {
  const {
    isLoading,
    data: offer,
    error,
    refetch,
  } = useQuery({
    queryKey: [OFFER_DETAIL_QUERY_ID, offerId],
    enabled: !!offerId,
    networkMode: 'online',
    staleTime: TIME['1_minute'],
    gcTime: TIME['5_minutes'],
    queryFn: queryFnOfferDetail,
  });

  return { isLoading, offer, error, refetch };
}
