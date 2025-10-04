import { ProfessionalProfile } from '@/types/claims';

export interface FacilityProfessionalsDTO {
  professionals: ProfessionalProfile[];
  placeholder: {
    input: string;
    professionalsList: string;
  };
}
