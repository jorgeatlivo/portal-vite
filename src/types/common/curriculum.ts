import { DetailRowDTO } from './widgets';

export interface QualificationDataDTO {
  title: string;
  subtitle?: string;
  cardKey?: string;
  livoExperience?: boolean;
  details: DetailRowDTO[];
}

export interface QualificationDTO {
  title: string;
  qualifications: QualificationDataDTO[];
  errorMessage?: string;
  description?: string;
  noQualificationsOption?: {
    displayText: string;
    selected: boolean;
  };
}

export interface LivoCVDetailsDTO {
  title: string;
  education: QualificationDTO;
  experience: QualificationDTO;
  internship?: QualificationDTO;
}

export enum CurriculumFormType {
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
  INTERNSHIP = 'internship',
}
export enum CVType {
  LIVO_CV = 'LIVO_CV',
  PDF_UPLOAD = 'PDF_UPLOAD',
}
