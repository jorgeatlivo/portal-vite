export interface TextDTO {
  displayText: string;
  color?: string;
  backgroundColor?: string;
  icon?: IconDTO;
  typographyStyle?: string;
  typographySize?: string;
}

export interface IconDTO {
  name: string;
  width?: string;
  color?: string;
  backgroundColor?: string;
}

export interface DetailRowDTO {
  displayText?: string;
  displayTextTypography?: TextDTO;
  icon?: IconDTO;
  additionalText?: string;
  additionalTextTypography?: TextDTO;
  gap?: number;
}
