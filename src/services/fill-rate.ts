import { api, handleApiError } from '@/services/api';
import { ShiftPublicationRequest } from '@/services/publish-shift';

import { IconDTO } from '@/types/common/widgets';

export interface FillRatePredictionParams
  extends Partial<Omit<ShiftPublicationRequest, 'startTime' | 'endTime'>> {
  startTime: string;
  endTime: string;
  category: string;
  recurrentDates: string[];
  temporalId: string | undefined;
  shiftId: number | undefined;
}

export enum ProvabilityValue {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface PredictionBandsCounter {
  low: number;
  medium: number;
  high: number;
}

export interface FillRatePrediction {
  predictedBand: ProvabilityValue;
  isDisplayed: boolean;
  startDate: string;
}

export interface CommonBannerDto {
  title?: string;
  body: string;
  color: string;
  backgroundColor: string;
  icon: IconDTO;
}

export interface ShiftFillRateResponse {
  predictions: FillRatePrediction[];
  bands: PredictionBandsCounter;
  temporalId: string;
  displayBanner: boolean;
  banner: CommonBannerDto;
}

export async function fetchShiftFillRateProbabilities(
  params: FillRatePredictionParams
) {
  const uri = '/facility/portal/shifts/predict-shift-fill-rate';
  return api
    .post<ShiftFillRateResponse>(uri, params)
    .then((res) => res.data)
    .catch(handleApiError);
}
