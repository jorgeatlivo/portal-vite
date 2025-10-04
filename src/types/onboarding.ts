export type ShiftOnboardingStatus = 'PENDING_APPROVAL' | 'APPROVED';

export type ShiftOnboarding = {
  specialization?: string;
  livoUnit?: string;
  professionalField?: string;
  startTime: string;
  finishTime: string;
  shiftTimeInDay: string;
  price: string;
};

export type ShiftOnboardingWithStatus = {
  status: ShiftOnboardingStatus;
  coverageShift: ShiftOnboarding;
};
