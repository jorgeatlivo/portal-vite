import { translate } from '@/services/i18next/translate';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';

export enum FacilityReviewStatusEnum {
  CONFIRMED = 'CONFIRMED',
  UNAVAILABLE = 'UNAVAILABLE',
  IN_REVIEW = 'IN_REVIEW',
  AVAILABLE_SOON = 'AVAILABLE_SOON',
}

type ColorThemeEnum = 'success' | 'default' | 'warning';

type ReviewStatusLabelProps = {
  [key in FacilityReviewStatusEnum]: {
    label: string;
    colorTheme: ColorThemeEnum;
  };
};

export const getReviewStatusLabelProps: () => ReviewStatusLabelProps = () => ({
  UNAVAILABLE: {
    label: translate('shift-claim-list:unavailable_tag_label'),
    colorTheme: 'default',
  },
  AVAILABLE_SOON: {
    label: translate('shift-claim-list:available_soon_tag_label'),
    colorTheme: 'default',
  },
  IN_REVIEW: {
    label: translate('shift-claim-list:in_review_tag_label'),
    colorTheme: 'warning',
  },
  CONFIRMED: {
    label: translate('shift-claim-list:confirmed_tag_label'),
    colorTheme: 'success',
  },
});

export const getStatusStyle = (status?: FacilityReviewStatusEnum | string) => {
  if (status === FacilityReviewStatusEnum.CONFIRMED) {
    return { bg: '#C2F0C6', text: '#1C4C21' };
  }
  if (status === FacilityReviewStatusEnum.IN_REVIEW) {
    return { bg: '#ed6c02', text: '#FFFFFF' };
  }
  return { bg: '#00000014', text: '#000000' };
};

export const modalityTags = {
  [ShiftModalityEnum.EXTERNAL]: {
    tagCode: ShiftModalityEnum.EXTERNAL,
    icon: 'livo',
    displayText: 'Livo',
    size: 18,
    color: colors['Action-Secondary'],
    backgroundColor: '#D9E8EB',
    iconClassNames: '-ml-[3px]',
  },
  [ShiftModalityEnum.INTERNAL]: {
    tagCode: ShiftModalityEnum.INTERNAL,
    displayText: 'Interno',
    icon: 'internal-hospital',
    size: 16,
    color: '#2BB198',
    backgroundColor: '#E3FDF0',
    iconClassNames: '',
  },
  [ShiftModalityEnum.REPEAT]: {
    tagCode: ShiftModalityEnum.REPEAT,
    displayText: 'Recurrente',
    icon: 'repeat',
    size: 16,
    color: colors['Text-Subtle'],
    backgroundColor: colors['Neutral-100'],
    iconClassNames: '',
  },
  [ShiftModalityEnum.ONBOARDING]: {
    tagCode: ShiftModalityEnum.ONBOARDING,
    displayText: 'Onboarding',
    icon: 'heart-handshake',
    size: 16,
    color: colors['Purple-600'],
    backgroundColor: colors['Purple-200'],
    iconClassNames: '',
  },
};
