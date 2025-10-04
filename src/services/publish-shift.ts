import { APIService, APIServiceName } from '@/services/api.service';

import { PublishShiftConfigurationDTO } from '@/types/publish-shift';
import {
  ShiftInvitationRequest,
  ShiftInvitationResponse,
} from '@/types/shift-invitation';

import { ShiftModalityEnum } from '@/types';
import { handleApiError } from './api';

export interface ShiftPublicationRequest {
  startTime: Date;
  endTime: Date;
  specialization: string;
  professionalField?: string;
  totalPay?: number;
  capacity: number;
  details: string;
  modality?: ShiftModalityEnum;
  unit?: string;
  externalVisible: boolean;
  internalVisible: boolean;
  recurrentDates: string[];
  category?: string;
  unitVisible: boolean;
  unitVisibleConfigurable?: boolean;
  compensationOptions: string[];
  onboardingShiftsRequired?: boolean;
  invitedProfessionalIds?: number[];
  temporalId?: string;
}

export function fetchPublishShiftConfiguration(category?: string) {
  const uri = '/facility/portal/shifts/publish-shift-config';
  const params = category ? { category } : undefined;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api
    .get<PublishShiftConfigurationDTO>(uri, {
      params,
    })
    .catch(handleApiError);
}

export function publishShift(shiftRequest: ShiftPublicationRequest) {
  const uri = '/facility/portal/shifts/create-shift';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post(uri, shiftRequest).catch(handleApiError);
}

export function fetchShiftInvitation(request: ShiftInvitationRequest) {
  const uri = '/facility/portal/shift-invitation/search';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.post<ShiftInvitationResponse>(uri, request).catch(handleApiError);
}

export interface CheckEligibleProfessionalsRequest {
  shiftConfig: {
    category: string;
    specialization?: string;
    unit?: string;
    professional_field?: string;
    endTime: string;
    startTime: string;
    externalVisible: boolean;
    internalVisible: boolean;
    recurrentDates: string[];
  };
  professionalIds: number[];
}

export interface CheckEligibleProfessionalsResponse {
  eligibleProfessionalIds: number[];
  inEligibleProfessionals: {
    professionalId: number;
    professionalName: string;
    reason: string;
  }[];
}

export function checkEligibleProfessionals(
  request: CheckEligibleProfessionalsRequest
) {
  const uri = '/facility/portal/shifts/check-eligible-professionals';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api
    .post<CheckEligibleProfessionalsResponse>(uri, request)
    .catch(handleApiError);
}
