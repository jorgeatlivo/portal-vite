import {
  Category,
  CategoryCode,
  CategoryDependentElement,
} from './common/category';
import { CVType } from './common/curriculum';
import { ProfessionalReviewInfo } from './professional-review';

export enum OfferClosedReason {
  FULLY_CLAIM = 'FULLY_CLAIM',
  EXPIRED = 'EXPIRED',
  HIRED = 'HIRED',
  CLOSED_UN_VERIFIED_BY_LIVO = 'CLOSED_UN_VERIFIED_BY_LIVO',
}

export type OfferClosedReasonCast = `${OfferClosedReason}`;

export interface Offer {
  id: number;
  category: OfferCategory;
  livoUnit?: string;
  professionalField?: string;
  contractType: ContractType;
  duration: string;
  compensation: OfferCompensation;
  status: OfferStatus;
  facilityType: string;
  totalNewClaims: number;
  badge: {
    // nullable
    displayText: string;
    color: string;
    backgroundColor: string;
  };
  statusTag: {
    displayText: string;
    color: string;
    backgroundColor: string;
  };
}

export interface OfferSubscription {
  status: SubscriptionStatus;

  maxPublicationsPerMonth: number;
  remainingPublicationsPerMonth: number;
  totalSlots: number;
  remainingSlots: number;
}

export interface OfferSlots extends OfferSubscription {
  offers: Offer[];
}

/* type ClosedOffersData = {
  offerId: number;
  offerSkill: string;
  closedReason: OfferClosedReason;
  closedTime: string;
}[]; */

export interface OfferCategory {
  code: string;
  acronym: string;
  displayText: string;
}

export interface OfferCompensation {
  displayText: string;
  defined: boolean;
}

export enum OfferStatus {
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  CLOSED_EXPIRED = 'CLOSED_EXPIRED',
  CANCELED = 'CANCELED',
  DRAFT = 'DRAFT',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export type OfferStatusCast = `${OfferStatus}`;

export interface OfferDetail {
  id: number;
  externalId: string;
  category: CategoryCode;
  categoryDisplayText: string;
  status: OfferStatus;
  statusTag: {
    displayText: string;
    color: string;
    backgroundColor: string;
  };
  contractType: ContractType;
  livoUnit: ValueDisplayPair;
  facilityId: number;
  facilityType: ValueDisplayPair;
  facilityName: string;
  professionalField: ValueDisplayPair;
  scheduleDetails?: string;
  startDate: {
    type: StartDateType;
    date: string;
  };
  duration?: {
    type: ContractDurationType | null | undefined;
    date: string | undefined;
  };
  schedules: ScheduleType[];
  salaryMin: string;
  salaryMax?: string;
  salaryPeriod: SalaryPeriodType;
  salaryDetails: string;
  perks: OfferPerk[];
  requirements: OfferRequirements[];
  additionalRequirements: string | null | undefined;
  details: string | null | undefined;
  totalNewClaims: number;
}

export interface ValueDisplayPair {
  value: string;
  displayText: string;
}

export interface Perk extends ValueDisplayPair {
  icon?: string;
}

export interface FacilityConfig {
  categories: ValueDisplayPair[];
  livoUnits: ValueDisplayPair[];
  professionalFields: ValueDisplayPair[];
  contractTypes: ValueDisplayPair[];
  startDate: ValueDisplayPair[];
  durationTypes: ValueDisplayPair[];
  contractSchedules: ValueDisplayPair[];
  salaryPeriods: ValueDisplayPair[];
  perks: Perk[];
  skillExperience: CategoryDependentElement[];
}

export enum ScheduleType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  HOLIDAYS = 'HOLIDAYS',
  COVERS = 'COVERS',
  FLEXIBLE = 'FLEXIBLE',
  ROTATING = 'ROTATING',
  WEEKENDS = 'WEEKENDS',
}

export type ScheduleTypeCast = `${ScheduleType}`;

export enum ContractType {
  PERMANENT = 'PERMANENT',
  TEMPORAL = 'TEMPORAL',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  LEAVE = 'LEAVE',
}

export type ContractTypeCast = `${ContractType}`;

export enum StartDateType {
  ASAP = 'ASAP',
  SPECIFIC_DATE = 'SPECIFIC_DATE',
}

export type StartDateTypeCast = `${StartDateType}`;

export enum ContractDurationType {
  ONE_MONTH = 'ONE_MONTH',
  TWO_MONTH = 'TWO_MONTH',
  THREE_MONTH = 'THREE_MONTH',
  LESS_THAN_SIX_MONTH = 'LESS_THAN_SIX_MONTH',
  LESS_THAN_ONE_YEAR = 'LESS_THAN_ONE_YEAR',
  SPECIFIC_DATE = 'SPECIFIC_DATE',
}

export type DurationTypeCast = `${ContractDurationType}`;

export enum SalaryPeriodType {
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  HOUR = 'HOUR',
  TOTAL = 'TOTAL',
}

export type SalaryPeriodCast = `${SalaryPeriodType}`;

export interface OfferPerk {
  displayText: string;
  icon: string;
  perk: string;
}

export interface OfferRequirements {
  experience: ValueDisplayPair;
  livoUnit: ValueDisplayPair;
  professionalField: ValueDisplayPair;
}

export interface OfferListingResponse {
  total: number;
  slots: OfferSlots | null;
  rows: Offer[];
  contactedReason: SubscriptionStatus;
}

export interface OfferClaimsResponse {
  total: number;
  totalNewClaims: number;
  rows: OfferClaim[];
}

export interface OfferClaim {
  id: number;
  status: OfferClaimStatus;
  newClaim: boolean;
  newScreeningSummary: boolean;
  zombieClaim: boolean;
  professionalProfile: OfferProfessionalProfile;
}

export interface DataPointVoSummary {
  dataPoint: string;
  value: {
    checked: boolean;
    displayText: string;
  };
}

export interface AvailableData {
  summary: DataPointVoSummary[];
}

export interface ScreeningSummary {
  notAvailableMessage: boolean | null;
  availableData: AvailableData;
}

export interface OfferProfessionalProfile {
  id: number;
  modality: string;
  skills: string[];
  fullName: string;
  email: string;
  category: Category;
  phoneNumber: string;
  profilePictureUrl: string;
  licenseNumber: string;
  professionalCV: string;
  cvSummary: string;
  professionalReview: ProfessionalReviewInfo;
  screeningSummary: ScreeningSummary | null;
  totalShiftsInFacility: number;
  favorite: boolean;
  availableCVTypes: CVType[];
}

export enum OfferClaimStatus {
  VISIBLE = 'VISIBLE',
  DETAILS_DISCLOSED = 'DETAILS_DISCLOSED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED',
}

export interface OfferClaimRejectReason {
  name: string;
  displayText: string;
}

export enum SubscriptionStatus {
  SLOT_AVAILABLE = 'SLOT_AVAILABLE',
  NO_SUBSCRIPTION = 'NO_SUBSCRIPTION',
  NO_SLOTS_LEFT = 'NO_SLOTS_LEFT',
  NO_PUBLICATIONS_LEFT = 'NO_PUBLICATIONS_LEFT',
  ZOMBIE_OFFER_REVEAL = 'ZOMBIE_OFFER_REVEAL',
}

export type SubscriptionStatusCast = `${SubscriptionStatus}`;
