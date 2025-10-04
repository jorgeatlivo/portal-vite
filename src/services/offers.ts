import { APIService, APIServiceName } from '@/services/api.service';

import {
  OfferClaimRejectReason,
  OfferClaimStatus,
  OfferClaimsResponse,
  OfferDetail,
  OfferListingResponse,
} from '@/types/offers';

import { api as axios, handleApiError } from './api';

type Params = {
  status?: string;
};

export function fetchOffers(status?: string): Promise<OfferListingResponse> {
  const uri = '/facility/portal/offers';
  const params: Params = {};
  if (status && status !== 'ALL') {
    params.status = status;
  }

  return axios
    .get(uri, { params })
    .then((response) => response.data)
    .catch(handleApiError);
}

export function fetchOfferClaims(
  offerId: number,
  status?: string
): Promise<OfferClaimsResponse> {
  const uri = `/facility/portal/offers/${offerId}/claims`;
  const params: Params = {};
  if (status && status !== 'ALL') {
    params.status = status;
  }

  return axios
    .get(uri, { params })
    .then((response) => response.data)
    .catch((error) => handleApiError(error));
}

export function fetchOfferDetail(offerId: number) {
  const uri = `/facility/portal/offers/${offerId}/details`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.get<OfferDetail>(uri).catch(handleApiError);
}

export function updateOfferClaimStatus(
  offerId: number,
  claimId: number,
  newStatus: OfferClaimStatus,
  reason?: string,
  reasonComment?: string
): Promise<void> {
  return axios
    .post(`/facility/portal/offers/${offerId}/claims/${claimId}`, {
      newStatus,
      reason,
      reasonComment,
    })
    .then((response) => response.data)
    .catch((error) => handleApiError(error));
}

export function fetchOfferClaimRejectReasons(): Promise<
  OfferClaimRejectReason[]
> {
  return axios
    .get('/facility/common/offer-claim-reject-reasons')
    .then((response) => response.data)
    .catch(handleApiError);
}

export function trackFacilityViewed(
  offerId: number,
  claimId: number
): Promise<void> {
  return axios
    .post(
      `/facility/portal/offers/${offerId}/claims/${claimId}/facility-viewed`
    )
    .then((response) => response.data)
    .catch(handleApiError);
}
