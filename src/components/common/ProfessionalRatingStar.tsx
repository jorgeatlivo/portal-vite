import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { ProfessionalReviewInfo } from '@/types/professional-review';

import colors from '@/config/color-palette';

interface ProfessionalRatingStarProps {
  professionalReview: ProfessionalReviewInfo;
  textColor?: string;
}

export const ProfessionalRatingStar: React.FC<ProfessionalRatingStarProps> = ({
  professionalReview,
  textColor,
}) => {
  const { t } = useTranslation(['shift-claim-details', 'professional-claim']);

  return professionalReview.totalReviews > 0 ? (
    <div className=":hovered:bg-Background-Secondary flex w-full flex-row items-center justify-start space-x-tiny">
      <LivoIcon
        name="star-filled"
        size={12}
        color={textColor ?? colors['Orange-400']}
      />
      <Typography
        variant="body/small"
        color={textColor ?? colors['Text-Default']}
      >
        {professionalReview.averageRating}
      </Typography>

      <Typography
        variant="body/small"
        color={textColor ?? colors['Text-Subtle']}
      >
        {t('professional-claim:review_label', {
          count: professionalReview?.totalReviews,
        })}
      </Typography>
    </div>
  ) : (
    <Typography
      variant={'info/caption'}
      color={textColor ?? colors['Text-Subtle']}
    >
      {t('no_reviews_label')}
    </Typography>
  );
};
