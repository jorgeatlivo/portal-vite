import { Logger } from '@/services/logger.service';

import { api, handleApiError } from './api';

export type FacilityStaffFilter = {
  search?: string;
  page?: string;
  size?: string;
};

export type FacilityPermission = {
  title: string;
  description: string;
  value: string;
  tabText: string;
};

export type FacilityUnit = {
  displayName: string;
  value: string;
};

export type FacilityStaff = {
  email: string;
  firstName: string;
  lastName: string;
  permissions: FacilityPermission[];
  units: FacilityUnit[];
  id: number;
  facilityAdmin: boolean;
};

export type CreateUpdateFacilityStaff = {
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  units: string[];
  facilityAdmin: boolean;
};

export type FacilityStaffResponse = {
  total: number;
  rows: FacilityStaff[];
  facilityHasUnitsConfigured: boolean;
};

export type FacilityStaffConfiguration = {
  permissions: FacilityPermission[];
  units: FacilityUnit[];
};

export function fetchFacilityStaff(
  filter: FacilityStaffFilter
): Promise<FacilityStaffResponse> {
  const queryParams = new URLSearchParams({ ...filter });
  const uri = `/facility/portal/facility-staff?${queryParams.toString()}`;
  return api
    .get(uri)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export const fetchFacilityStaffConfiguration =
  (): Promise<FacilityStaffConfiguration | void> => {
    const uri = '/facility/portal/facility-staff/get-member-configuration';

    return api
      .get(uri)
      .then((response) => {
        return response.data;
      })
      .catch(handleApiError);
  };

export const createFacilityStaff = (
  facilityStaff: CreateUpdateFacilityStaff
): Promise<void> => {
  const uri = '/facility/portal/facility-staff/create';

  return api
    .post(uri, facilityStaff)
    .then((response) => {
      Logger.info('Response', response);
    })
    .catch(handleApiError);
};

export const updateFacilityStaff = (
  facilityStaff: CreateUpdateFacilityStaff,
  id: number
): Promise<void> => {
  const uri = `/facility/portal/facility-staff/${id}/update`;

  return api
    .post(uri, facilityStaff)
    .then((response) => {
      Logger.info('Response', response);
    })
    .catch(handleApiError);
};

export const deleteFacilityStaff = (id: number): Promise<void> => {
  const uri = `/facility/portal/facility-staff/${id}/delete`;

  return api
    .post(uri)
    .then((response) => {
      Logger.info('Response', response);
    })
    .catch(handleApiError);
};
