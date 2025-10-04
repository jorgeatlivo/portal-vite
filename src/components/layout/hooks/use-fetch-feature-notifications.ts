import { useQuery } from '@tanstack/react-query';

import {
  FeatureNotificationsResponse,
  getFeatureNotifications,
} from '@/services/notifications';

export const FEATURE_NOTIFICATIONS_QUERY_KEY =
  'FEATURE_NOTIFICATIONS_QUERY_KEY';

export const useFeatureNotifications = () => {
  const { data } = useQuery<FeatureNotificationsResponse>({
    queryKey: [FEATURE_NOTIFICATIONS_QUERY_KEY],
    queryFn: getFeatureNotifications,
    refetchInterval: 60000,
  });

  return {
    newOfferClaims: data?.newOfferClaims ?? 0,
  };
};
