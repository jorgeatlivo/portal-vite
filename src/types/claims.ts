import { SkillDefinition } from '@/services/account';

import { ShiftOnboarding } from '@/types/onboarding';

import { ShiftModalityEnum } from '@/types';
import { Category } from './common/category';
import { CVType } from './common/curriculum';
import { DisclaimerDTO } from './common/disclaimers';
import { ProfessionalReviewInfo } from './professional-review';

type ProfessionalTag = {
  label: string;
  styling: {
    backgroundColor?: string;
    icon?: string;
    textColor?: string;
  } | null;
};

export type ProfessionalDataField = {
  key: string;
  label: string;
  value: string;
  values: [
    {
      value: string;
      displayText: string;
    },
  ];
  displayText: string;
  editable: boolean;
};

export interface ProfessionalProfile {
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  phoneNumber: string;
  licenseNumber: string;
  professionalCV: string;
  status: string;
  professionalReview: ProfessionalReviewInfo;
  totalPerformedShifts: number;
  firstShifterForFacility: boolean;
  tags: ProfessionalTag[];
  internal: {
    dataFields: ProfessionalDataField[];
  } | null;
  totalShiftsInFacility: {
    totalShiftsInFacility: number;
    shiftsInFacility: [
      {
        unit: string;
        numberOfShifts: number;
      },
    ];
    facilityName: string;
  };
  category: Category;
  favorite?: boolean;
  modality?: ShiftModalityEnum;
  skills: {
    professionalSkills: string[];
    skillDefinitions: SkillDefinition[];
  };
  availableCVTypes: CVType[];
  cvSummary?: string | null;
}

enum CompensationOptionType {
  EXTRA_PAY = 'EXTRA_PAY',
  TIME_OFF = 'TIME_OFF',
  SHIFT_SWAP = 'SHIFT_SWAP',
}

export type CompensationOption = {
  type: CompensationOptionType;
  label: string;
  compensationValue: string;
};

export enum ClaimStatus {
  APPROVED = 'APPROVED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE',
  PENDING_PRO_ACCEPT = 'PENDING_PRO_ACCEPT',
  REJECTED_BY_PRO = 'REJECTED_BY_PRO',
  INVITATION_EXPIRED = 'INVITATION_EXPIRED',
  PRO_NOT_AVAILABLE = 'PRO_NOT_AVAILABLE',
}

export type SlotReason = {
  value?: string;
  displayText: string;
  comment?: string;
};
export type SlotReasonOption = {
  value: string;
  displayText: string;
};

export interface ClaimRequest {
  claimedAt: string;
  id: 0;
  status: ClaimStatus;
  statusUpdatedAt: string;
  professionalProfile: ProfessionalProfile;
  invitation: boolean;
  invitationExpirationTime: string | null;
  compensationOption: CompensationOption | null;
  modality: ShiftModalityEnum | null;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  cancellationRequest: {
    requestedAt: string;
    reason: string;
  };
  slotReason: SlotReason | null;
  slotReasonOptions?: SlotReasonOption[];
  slotReasonCommentDisplayed: boolean;
  disclaimer?: DisclaimerDTO;
  skipConstraints?: boolean;
  onboardingShift?: ShiftOnboarding;
  coverageShift?: ShiftOnboarding;
  noOnboardingClaimReason: string;
}

export type DenarioErrorPayload = {
  type: 'FAILED_ACCEPT_CLAIM_WITH_RETRY_ALLOWANCE';
  title: string;
  description: string;
  actions: {
    primary: {
      title: string;
      color?: string;
      backgroundColor?: string;
    };
    secondary: {
      title: string;
      color?: string;
      backgroundColor?: string;
    };
  };
};
