import { APIService, APIServiceName } from '@/services/api.service';

import { handleApiError } from './api';

export type CitiesResponse = {
  code: string;
  name: string;
}[];

export type displayOfferTopBannerResponse = {
  displayOfferTopBanner: boolean;
};

export function getListSupportedCities() {
  const url = '/facility/portal/common/cities';
  const api = APIService.getInstance(APIServiceName.PUBLIC);

  return api.get<CitiesResponse>(url).catch(handleApiError);
}

export function getDisplayOfferTopBanner(): Promise<displayOfferTopBannerResponse> {
  const url = '/facility/portal/display-offer-top-banner';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.get<displayOfferTopBannerResponse>(url).catch(handleApiError);
}
