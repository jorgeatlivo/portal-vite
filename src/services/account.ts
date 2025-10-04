import { Category } from '@/types/common/category';
import { Unit } from '@/types/shifts';

import { api, handleApiError } from './api';

export type FacilitySummary = {
  id: number;
  name: string;
  imgUrl: string;
  totalNewOfferClaims: number;
  selected: boolean;
};

export type FacilityGroupInfo = {
  name: string;
  facilities: FacilitySummary[];
};

export type FacilityInfo = {
  id: number;
  name: string;
  publicName: string | null;
  cif: string | null;
  webPage: string | null;
  address: string;
  addressCity: string;
  addressCountry: string;
  latitude: number;
  longitude: number;
  mapLink: string;
  multipleClaimsEnabled: boolean;
  categories: Category[];
  skillsByCategory: { [key: string]: SkillDefinition[] };
  livoInternalOnboardingStrategy: string | null;
  portalShiftsOrderingByEnabled: boolean;
  status: string;
};

export type AccountInfo = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  facility: FacilityInfo;
  livoInternalOnboarded: boolean;
  livoPoolOnboarded: boolean;
  visibleTabMenu: (VisibleTabEnum | ProtectedRoutesEnum)[];
  userFeatures: UserFeatureEnum[];
  lastTimeSignIn: string;
  units: Unit[] | null;
  locale: string;
  facilityGroup?: FacilityGroupInfo;
};

export type SkillDefinition = {
  value: string;
  displayText: string;
};

export enum ACCOUNT_TYPE {
  FACILITY = 'facility',
  PROFFESIONAL = 'professional',
}

export const fetchAccountInfo = (): Promise<AccountInfo> => {
  const url = '/facility/portal/account/profile';
  return api
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
};

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const changePasswordRequest = async (
  changePasswordData: ChangePasswordData
): Promise<boolean | void> => {
  const url = '/facility/account/change-password';

  return api
    .post(url, changePasswordData)
    .then((response) => response.status === 200)
    .catch(handleApiError);
};

export const resetPasswordRequest = (email: string) => {
  const url = '/facility/account/forgotten-password/request-reset-password';
  const body = { email: email };

  return api
    .post(url, body)
    .then((response) => response.status === 200)
    .catch(handleApiError);
};

export const resetPassword = (
  accountType: ACCOUNT_TYPE,
  token: string,
  newPassword: string
) => {
  const url = `/${accountType}/account/forgotten-password/reset-password`;
  const body = { token, newPassword };

  return api
    .post(url, body)
    .then((response) => response.status === 200)
    .catch(handleApiError);
};

export const validateToken = (accountType: ACCOUNT_TYPE, token: string) => {
  const url = `/${accountType}/account/forgotten-password/verify-token?token=${token}`;

  return api.get(url).catch(handleApiError);
};

export const verifyMFARequest = (
  email: string,
  code: string
): Promise<string | void> => {
  const url = '/facility/account/verify-login-mfa';
  const body = { email: email, mfaCode: code };

  return api
    .post(url, body)
    .then(
      (response) => `${response.data.tokenType} ${response.data.accessToken}`
    )
    .catch(handleApiError);
};

export enum VisibleTabEnum {
  CALENDAR = 'CALENDAR',
  ACTIONABLE_SHIFTS = 'ACTIONABLE_SHIFTS',
  NEXT_SHIFTS_LIST = 'NEXT_SHIFTS_LIST',
  OFFER_MANAGEMENT = 'OFFER_MANAGEMENT',
  LEGAL_DOCUMENTATION = 'LEGAL_DOCUMENTATION',
  INTERNAL_STAFF_MANAGEMENT = 'INTERNAL_STAFF_MANAGEMENT',
  CONFIGURATION_MANAGEMENT = 'CONFIGURATION_MANAGEMENT',
}

export enum ProtectedRoutesEnum {
  SHIFT_CLAIM_DETAILS = 'SHIFT_CLAIM_DETAIL',
}

export enum UserFeatureEnum {
  FAVOURITE_PROFESSIONALS_MANAGEMENT = 'FAV_PRO_MGMT',
  SHIFT_UNIT_AND_PRO_FIELDS_ENABLED = 'SHIFT_UNIT_AND_FIELDS_ENABLED',
  FACILITY_PROFESSIONAL_INVITE_ENABLED = 'FACILITY_PROFESSIONAL_INVITE_ENABLED',
}
