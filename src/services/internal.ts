import {
  DataFieldSubmission,
  DenarioProfessional,
  FacilityDataFieldDefinition,
  InternalProfessional,
} from '@/types/internal';

import { api, handleApiError } from './api';

export interface UpdateInternalProfessionalRequest {
  dataFields: DataFieldSubmission[];
  category: string;
  professionalSkills: string[];
}

export function fetchInternalProfessionalInfo(
  professionalId: number
): Promise<InternalProfessional> {
  const url = `/facility/portal/internal-professionals/${professionalId}`;

  return api
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export function updateInternalProfessionalInfo(
  professionalId: number,
  request: UpdateInternalProfessionalRequest
): Promise<InternalProfessional> {
  const url = `/facility/portal/internal-professionals/${professionalId}/update-profile`;
  return api
    .post(url, request)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export function acceptProfessionalRequest(
  professionalId: number,
  request: UpdateInternalProfessionalRequest
): Promise<boolean> {
  const url = `/facility/portal/internal-professionals/${professionalId}/accept-request`;
  return api
    .post(url, request)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export function rejectProfessionalRequest(
  professionalId: number
): Promise<boolean> {
  const url = `/facility/portal/internal-professionals/${professionalId}/reject-request`;
  return api
    .post(url)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export function deleteProfessional(professionalId: number): Promise<boolean> {
  const url = `/facility/portal/internal-professionals/${professionalId}/remove`;
  return api
    .post(url)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export function getDataFieldDefinitions(): Promise<
  FacilityDataFieldDefinition[]
> {
  const url = `/facility/portal/facility-config/data-field-definitions`;

  return api
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

export function getDenarioProfessional(
  nationalId: string
): Promise<DenarioProfessional | string> {
  const url = `/facility/portal/internal-professionals/load-denario-professional-by-national-id?nationalId=${nationalId}`;
  return api
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.data.errorMessage;
    });
}
