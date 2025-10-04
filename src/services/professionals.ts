import { FacilityProfessionalsDTO } from '@/components/widgets/professionals/types';

import { LivoCVDetailsDTO } from '@/types/common/curriculum';
import { ProfessionalProfileBrief } from '@/types/professional';

import { handleApiError } from './api';
import { APIService, APIServiceName } from './api.service';

// Types for the search API
export interface PortalProfessionalSearchVo {
  id: number;
  name: string;
  avatarUrl: string | null;
  favorite: boolean;
  completedShiftsInFacility: number;
}

export interface ProfessionalSearchResponse {
  total: number;
  professionals: PortalProfessionalSearchVo[];
}

export interface ProfessionalSearchParams {
  name?: string;
  selectedProfessionalIds?: string[];
}

export function fetchFacilityProfessionals() {
  const uri = '/facility/portal/professionals';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);
  return api.get<FacilityProfessionalsDTO>(uri).catch(handleApiError);
}

export function updateFacilityProfessional(
  professionalId: string,
  favorite: boolean
) {
  const uri = `/facility/portal/professionals/${professionalId}/update-favorite`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);
  return api
    .post<void>(uri, null, { params: { favorite } })
    .catch(handleApiError);
}

export function fetchProfessionalCVDetails(professionalId: number) {
  const uri = `/facility/portal/professionals/${professionalId}/cv-details`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);
  return api.get<LivoCVDetailsDTO>(uri).catch(handleApiError);
}

export function fetchProfessionalProfile(professionalId: string | number) {
  const uri = `/facility/portal/professionals/${professionalId}/profile`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);
  return api.get<ProfessionalProfileBrief>(uri).catch(handleApiError);
}

export function searchProfessionals(params: ProfessionalSearchParams) {
  const uri = '/facility/portal/professionals/search';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);
  return api
    .get<ProfessionalSearchResponse>(uri, {
      params: {
        name: params.name,
        selectedProfessionalIds: params.selectedProfessionalIds?.join(','),
      },
    })
    .catch(handleApiError);
}
