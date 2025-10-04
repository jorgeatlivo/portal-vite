import { APIService, APIServiceName } from '@/services/api.service';

import {
  ContractDurationType,
  ContractType,
  FacilityConfig,
  OfferDetail,
  OfferSubscription,
  ScheduleType,
  StartDateType,
  SubscriptionStatus,
} from '@/types/offers';

import { handleApiError } from './api';

export function getFacilityConfig() {
  const url = '/facility/portal/offers/config';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.get<FacilityConfig>(url).catch(handleApiError);
}

export type MutateOfferPayload = {
  category: string;
  contractType: ContractType;
  startDate: {
    type: StartDateType;
    date?: string;
  };
  duration?: {
    type: ContractDurationType;
    date?: string;
  };
  livoUnit?: string;
  professionalField?: string;
  schedule: ScheduleType[];
  scheduleDetails?: string;
  salaryMin: number;
  salaryMax?: number;
  salaryPeriod: string;
  salaryDetails?: string;
  perks: string[];
  requirements?: {
    experience: string;
    livoUnit?: string;
    professionalField?: string;
  }[];
  additionalRequirements?: string;
  facilityId?: number;
  details?: string;
};

export type EditOfferPayload = Omit<MutateOfferPayload, 'category' | 'skill'>;

export type CreateOfferResponse = {
  details: OfferDetail;
  subscription: OfferSubscription;
};

export type PublishOfferResponse = {
  offerId: number;
};

export function createDraftOffer(payload: MutateOfferPayload) {
  const url = '/facility/portal/offers/create-as-draft';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post<CreateOfferResponse>(url, payload).catch(handleApiError);
}

export function publishOffer(offerId: number) {
  const url = `/facility/portal/offers/${offerId}/publish`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post<PublishOfferResponse>(url).catch(handleApiError);
}

export function closeOffer(offerId: number) {
  const url = `/facility/portal/offers/${offerId}/close`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post<undefined>(url).catch(handleApiError);
}

export function editOffer(offerId: number, payload: EditOfferPayload) {
  const url = `/facility/portal/offers/${offerId}/update`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post<undefined>(url, payload).catch(handleApiError);
}

export function contactLivo(
  reason: SubscriptionStatus,
  source: 'OFFER_PUBLISHING' | 'OFFER_LISTING' | 'ZOMBIE_OFFER'
) {
  const url = '/facility/portal/offers/contact';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api
    .post<undefined>(url, {
      reason,
      source,
    })
    .catch(handleApiError);
}

export function contactLivoOnboardingShift(
  coverageShiftId: number,
  coverageShiftClaimId?: number | null
) {
  const url = '/facility/portal/shifts/contact-for-onboarding-shift-schedule';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api
    .post<undefined>(url, {
      coverageShiftId,
      coverageShiftClaimId,
    })
    .catch(handleApiError);
}
