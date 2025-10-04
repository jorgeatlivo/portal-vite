import { APIService, APIServiceName } from '@/services/api.service';

import { ValueDisplayPair } from '@/types/offers';

import { handleApiError } from './api';

interface SignUpStartResponse {
  emailExist: boolean;
}

export function confirmEmailAvailable(email: string) {
  const url = '/facility/portal/account/check-email-exist';
  const api = APIService.getInstance(APIServiceName.PUBLIC);

  return api.post<SignUpStartResponse>(url, { email }).catch(handleApiError);
}

export type SignUpPayload = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type SignUpResponse = {
  accessToken: string;
  tokenType: 'Bearer' | 'Basic';
  registerCompleted: boolean;
};

export function createNewAccount(payload: SignUpPayload) {
  const url = '/facility/portal/account/sign-up';
  const api = APIService.getInstance(APIServiceName.PUBLIC);

  return api.post<SignUpResponse>(url, payload).catch(handleApiError);
}

export interface SignInPayload {
  userName: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  tokenType: string;
  registerCompleted: boolean;
}

export function login(payload: SignInPayload) {
  const url = '/facility/portal/account/sign-in';
  const api = APIService.getInstance(APIServiceName.PUBLIC);
  return api.post<SignInResponse>(url, payload).catch(handleApiError);
}

export type CreateFacilityPayload = {
  legalName: string;
  publicName: string;
  cif: string;
  address: string;
  webPage: string;
  cityCode: string;
  facilityType: string;
  otherFacilityTypeName?: string;
};

export function createFacility(payload: CreateFacilityPayload) {
  const url = '/facility/portal/account/create-facility';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post<SignUpResponse>(url, payload, {}).catch(handleApiError);
}

export function getAccountConfig() {
  const url = '/facility/portal/account/config';
  const api = APIService.getInstance(APIServiceName.PUBLIC);
  return api
    .get<{ facilityTypes: ValueDisplayPair[] }>(url)
    .then((res) => ({
      ...res,
      facilityTypes: res.facilityTypes.map((type) => ({
        value: type.value,
        label: type.displayText,
      })),
    }))
    .catch(handleApiError);
}
