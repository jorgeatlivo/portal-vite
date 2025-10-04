import { ShiftModalityEnum } from '@/types';
import { ClaimStatus } from './claims';
import { Category } from './common/category';
import { CVType } from './common/curriculum';
import { ProfessionalReviewInfo } from './professional-review';

export type ProfessionalStatus = ClaimStatus;

export type ShiftInFacility = {
  unit: string;
  numberOfShifts: number;
};

export type ProfessionalProfileBrief = {
  id: number;
  modality: ShiftModalityEnum;
  category: Category;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  phoneNumber: string;
  profilePictureUrl: string;
  licenseNumber: string;
  professionalCV: string;
  availableCVTypes: CVType[];
  status: ProfessionalStatus;
  professionalReview: ProfessionalReviewInfo;
  totalPerformedShifts: number;
  firstShifterForFacility: boolean | null;
  tags: string[];
  internal: boolean | null;
  totalShiftsInFacility: number;
  favorite: boolean;
  cvSummary: string | null;
};
