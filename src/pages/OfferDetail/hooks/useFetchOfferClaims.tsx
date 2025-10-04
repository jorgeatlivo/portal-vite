import { useQuery } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';
import { queryFnOfferClaims } from '@/queries/offer-claims';
import { OFFER_DETAIL_QUERY_ID } from '@/queries/offer-detail';

export default function useFetchOfferClaims(offerId: string, filter?: string) {
  const {
    isLoading,
    data: claimsResponse,
    error,
    refetch,
  } = useQuery({
    queryKey: [OFFER_DETAIL_QUERY_ID, offerId, filter],
    enabled: !!offerId,
    networkMode: 'online',
    staleTime: TIME['10_seconds'],
    gcTime: TIME['30_seconds'],
    queryFn: queryFnOfferClaims,
  });

  return { isLoading, claimsResponse, error, refetch };
}
