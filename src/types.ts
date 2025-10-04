import { SlotReason } from '@/types/claims';
import { Shift } from '@/types/shifts';

import { Category } from './types/common/category';
import { FacilityReviewStatusEnum } from './utils/constants';

export interface ProfessionalInitProfile {
  id: number;
  firstName: string;
  lastName: string;
  category: Category;
  secondLastName?: string;
  phoneNumber: string;
  profilePictureUrl: string;
  licenseNumber: string;
  professionalCV: string;
  status: string;
  internal: boolean;
  email: string;
  firstShifter?: boolean;
}

export interface ShiftClaim {
  shiftClaimId: number;
  shift: Shift<string>;
  facilityName: string;
  professionalInitProfile: ProfessionalInitProfile;
  facilityReviewStatus: FacilityReviewStatusEnum;
  slotReason?: SlotReason;
  hrIntegrationProcessedTime: string;
}

export interface ProfessionalLegalProfile {
  socialSecurityNumber: string;
  address: string;
  bankAccountNumber: string;
  deductionPercentage: number;
  nationalIdUrl: string;
  certificateUrl: string;
  extraCertificateUrl1: string;
  extraCertificateUrl2: string;
  extraCertificateUrl3: string;
  paymentReceiptUrl: string;
  noConvictionCertificateUrl: string;
  bankAccountDocumentUrl: string;
  incomeRetentionChangeRequestUrl: string;
  socialSecurityNumberDocumentUrl: string;
  nationalId: string;
  nationalIdDocExpired: boolean;
}

export interface ShiftClaimDetails extends ShiftClaim {
  professionalLegalProfile: ProfessionalLegalProfile | undefined;
}

export enum ShiftModalityEnum {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  REPEAT = 'REPEAT',
  ONBOARDING = 'ONBOARDING',
}
