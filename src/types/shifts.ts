import { ShiftOnboardingWithStatus } from '@/types/onboarding';

import { ClaimRequest } from './claims';
import { Category } from './common/category';
import { ValueDisplayPair } from './offers';

export interface SpecializationDTO {
  name: string;
  translationDefault: string;
  displayText: string;
  translations: {
    es: string;
  };
}
export enum ShiftTimeInDayEnum {
  MORNING = 'DAY_SHIFT',
  EVENING = 'EVENING_SHIFT',
  NIGHT = 'NIGHT_SHIFT',
}
export enum ShiftTimeStatusEnum {
  PAST = 'PAST',
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
}

export type Unit = {
  displayName: string;
  value: string;
};

export interface Shift<T = ValueDisplayPair> {
  id: number;
  shiftTimeInDay: ShiftTimeInDayEnum;
  date: string;
  status: string;
  capacity: number;
  specialization: SpecializationDTO;
  totalAcceptedClaims: number;
  totalAcceptedClaimsWithoutHRIntegration?: number;
  totalPendingClaims: number;
  hourRate: string;
  totalPay: string;
  formattedTotalPay: string;
  currency: string;
  startTime: string;
  finishTime: string;
  details?: string;
  shiftTimeStatus: ShiftTimeStatusEnum;
  unit: string;
  professionalField?: T;
  internalVisible: boolean;
  externalVisible: boolean;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  totalCancellationRequests: number;
  claims: ClaimRequest[];
  recurrentDates: string[];
  cancellableShiftDates: string[];
  externalId: string;
  shouldShowSlotReasonList: boolean;
  createdAt: string;
  skills: {
    displayText: string;
    value: string;
  }[];
  category: Category;
  title: string;
  holiday?: boolean;
  unitVisible: boolean;
  compensationOptions: {
    value: string;
    displayText: string;
  }[];
  onboardingShiftsRequired: boolean;
  onboardingShiftsPrice: string;
  shiftActionsAllow: boolean;
  onboarding?: ShiftOnboardingWithStatus | null;
  totalPendingInvitationClaims?: number;
}

export interface DayShift {
  date: string;
  holiday?: boolean;
  shifts: Shift[];
  hasAlert: boolean;
}

export interface FilterConfiguration {
  withPendingClaims?: boolean;
  isFilled?: boolean;
  units?: string[];
  onboardingShifts?: boolean;
  professionalIds?: string;
}

export enum ActionComponentIdEnum {
  EDIT = 'EDIT',
  COPY = 'COPY',
}
