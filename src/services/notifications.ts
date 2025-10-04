import { APIService, APIServiceName } from '@/services/api.service';

import { handleApiError } from './api';

export type FeatureNotificationsResponse = {
  newOfferClaims: number;
};

export function getFeatureNotifications(): Promise<FeatureNotificationsResponse> {
  const url = '/facility/portal/feature-notifications';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.get<FeatureNotificationsResponse>(url).catch(handleApiError);
}
