import { useQuery } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';
import {
  OFFER_CONFIG_QUERY_KEY,
  queryFnOfferConfig,
} from '@/queries/offer-mutation';

export default function useFetchOfferConfig() {
  const {
    isLoading,
    isFetched: isConfigFetched,
    data: config,
    error,
  } = useQuery({
    queryKey: [OFFER_CONFIG_QUERY_KEY],
    networkMode: 'online',
    staleTime: TIME['5_minutes'],
    gcTime: TIME['15_minutes'],
    queryFn: queryFnOfferConfig,
  });

  return { isLoading, config, error, isConfigFetched };
}
