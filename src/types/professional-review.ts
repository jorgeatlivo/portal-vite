import { SpecializationDTO } from './shifts';

export type ReviewFeedback = {
  generalRating: number;
  feedback: string;
};

export type ProfessionalReview = {
  facilityName: string;
  specialization: SpecializationDTO;
  review: ReviewFeedback;
  month: string;
  year: number;
};

export type ProfessionalReviewInfo = {
  averageRating: number | null;
  totalReviews: number;
  reviews: ProfessionalReview[];
};
