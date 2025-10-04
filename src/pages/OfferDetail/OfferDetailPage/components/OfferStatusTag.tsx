import { useTranslation } from 'react-i18next';

import { TagLabel } from '@/components/common/TagLabel';

import colors from '@/config/color-palette';

interface OfferClaimStatusPros {
  status: 'VISIBLE' | 'DETAILS_DISCLOSED' | 'REJECTED' | 'HIRED';
}

export const OfferClaimStatusTag: React.FC<OfferClaimStatusPros> = ({
  status,
}) => {
  const { t } = useTranslation('offers');

  const offerStatusBackground = {
    VISIBLE: colors['Primary-100'],
    DETAILS_DISCLOSED: colors['Positive-200'],
    REJECTED: colors['Grey-100'],
    HIRED: colors['Green-500'],
  };
  const offerStatusColor = {
    VISIBLE: colors['Grey-950'],
    REJECTED: colors['Grey-950'],
    DETAILS_DISCLOSED: colors['Grey-950'],
    HIRED: '#FFFFFF',
  };
  const offerStatusText = {
    VISIBLE: t('candidate_visible') as string,
    DETAILS_DISCLOSED: t('candidate_details_disclosed') as string,
    REJECTED: t('candidate_rejected') as string,
    HIRED: t('candidate_hired') as string,
  };

  return (
    <TagLabel
      text={offerStatusText[status]}
      color={offerStatusColor[status]}
      backgroundColor={offerStatusBackground[status]}
    />
  );
};
