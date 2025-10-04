import { SkillDefinition } from '@/services/account';

import { ProfessionalDataField } from './claims';
import { Category } from './common/category';

export enum InvitationStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
}

export type InternalProfessional = {
  id: number;
  phoneNumber: string;
  phoneNumberDisclaimer: string | undefined;
  firstName: string;
  lastName: string;
  secondLastName: string;
  email: string;
  phone: string;
  enabled: boolean;
  profilePictureUrl: string;
  invitationStatus: InvitationStatus;
  disclaimer: InternalProfessionalNotes;
  dataFields: ProfessionalDataField[];
  category: Category;
  categoryEditable: boolean;
  skills: {
    professionalSkills: string[];
    skillDefinitions: SkillDefinition[];
  };
  unit: string;
};

export function internalProfessionalDisplayName(
  professional: InternalProfessional
) {
  if (professional.secondLastName) {
    return `${professional.lastName} ${professional.secondLastName}, ${professional.firstName} `;
  }
  return `${professional.lastName}, ${professional.firstName}`;
}

export type InternalProfessionalNotes = {
  severity: string;
  message: string;
};

export type DataFieldSubmission = {
  key: string;
  selectedValues: string[]; // string is the value of the selected option, or the text for freeText
  editable: boolean | undefined;
};

export type DataFieldOption = {
  value: string;
  displayText: string;
};

export enum DataFieldType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  FREE_TEXT = 'FREE_TEXT',
}

export type FacilityDataFieldDefinition = {
  key: string;
  label: string;
  type: DataFieldType;
  options: DataFieldOption[];
  editable: boolean;
};

export type DenarioProfessional = {
  nationalId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  category: string;
  unit: string;
};
