export interface ShiftInvitationConfig {
  category: string;
  specialization?: string;
  unit?: string;
  professionalField?: string;
  endTime: string;
  startTime: string;
  externalVisible: boolean;
  internalVisible: boolean;
  recurrentDates: string[];
}

export interface ShiftInvitationSearch {
  name?: string;
  selectedProfessionalIds?: number[];
}

export interface ShiftInvitationRequest {
  shiftConfig: ShiftInvitationConfig;
  search: ShiftInvitationSearch;
  page?: number;
  size?: number;
}

export interface ShiftInvitationProfessional {
  id: number;
  name: string;
  avatarUrl: string | null;
  favorite: boolean;
  completedShiftsInFacility: number;
  role: 'PROFESSIONAL' | 'INTERNAL_PROFESSIONAL';
  note: string | null;
}

export interface ShiftInvitationResponse {
  page: number;
  total: number;
  finalPage: boolean;
  professionals: ShiftInvitationProfessional[];
}
