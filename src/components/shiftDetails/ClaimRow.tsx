import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import { TagLabel } from '@/components/common/TagLabel';
import FavoriteTag from '@/components/professionals/FavoriteTag';

import { ClaimRequest, ClaimStatus } from '@/types/claims';
import { markdown } from '@/utils/markdown';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import Countdown from './Countdown';
import { ProfilePicture } from './ProfilePicture';

interface ClaimRowProps {
  claim: ClaimRequest;
  onClick?: () => void;
  style?: any;
}

export const ClaimRow: React.FC<ClaimRowProps> = ({
  claim,
  style,
  onClick,
}) => {
  const { t } = useTranslation([
    'professional-claim',
    'shift-claim-details',
    'professionals/profile',
  ]);

  const renderSubtitle = (_claim: ClaimRequest) => {
    const {
      modality,
      professionalProfile,
      cancellationRequest,
      compensationOption,
    } = _claim || {};

    if (modality === ShiftModalityEnum.EXTERNAL || !modality) {
      if (professionalProfile?.firstShifterForFacility) {
        return (
          <Typography variant={'info/caption'} color={colors['Purple-500']}>
            {t('professional-claim:first_shifter_label')}
          </Typography>
        );
      }

      if (professionalProfile?.favorite) {
        return <FavoriteTag />;
      }

      if (professionalProfile?.professionalReview.totalReviews > 0) {
        return (
          <div className=":hovered:bg-Background-Secondary flex w-full flex-row items-center justify-start space-x-tiny">
            <LivoIcon
              name="star-filled"
              size={12}
              color={colors['Orange-400']}
            />
            <Typography variant={'body/small'}>
              {professionalProfile?.professionalReview.averageRating}
            </Typography>

            <Typography variant={'body/small'} color={colors['Text-Subtle']}>
              {t('professional-claim:review_label', {
                count: professionalProfile?.professionalReview.totalReviews,
              })}
            </Typography>
          </div>
        );
      }

      return (
        <Typography variant={'info/caption'} color={colors['Text-Subtle']}>
          {t('shift-claim-details:no_reviews_label')}
        </Typography>
      );
    }

    if (cancellationRequest) {
      return (
        <Typography variant={'info/caption'} color={colors['Negative-500']}>
          {t('shift-claim-details:cancellation_request')}
        </Typography>
      );
    }

    return (
      <div className="flex w-full flex-col justify-center">
        <div className="flex w-full flex-row flex-wrap items-center gap-y-tiny space-x-tiny">
          {professionalProfile.tags?.map((tag, index) => (
            <TagLabel
              key={index}
              text={tag.label}
              color={tag.styling?.textColor || undefined}
              backgroundColor={
                tag.styling?.backgroundColor || colors['Neutral-100']
              }
            />
          ))}
        </div>
        {compensationOption && (
          <Typography variant={'info/caption'} color={colors['Text-Subtle']}>
            {compensationOption?.label}: {compensationOption.compensationValue}
          </Typography>
        )}
      </div>
    );
  };

  const totalShifts =
    claim?.professionalProfile?.totalShiftsInFacility?.totalShiftsInFacility;

  return (
    <div className="flex h-full flex-row gap-3">
      <ProfilePicture
        profilePictureUrl={claim.professionalProfile?.profilePictureUrl}
        modality={claim.modality}
        size={48}
        style={style}
      />
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <Typography variant="heading/small" className="truncate">
          {claim.professionalProfile?.firstName}{' '}
          {claim.professionalProfile.lastName}
        </Typography>
        <div className="py-0.5">{renderSubtitle(claim)}</div>
        {/* {subtitleComponent} */}
        {!!totalShifts && (
          <Typography variant="body/small" className="!mt-0 text-Text-Subtle">
            {markdown(
              `{color:${colors['Text-Default']}}${t(
                'professionals/profile:total_shifts_subtitle',
                {
                  num: totalShifts,
                }
              )}{/color} `
            )}
            {t('professionals/profile:total_shifts_subtitle_in_facility')}
          </Typography>
        )}
        {onClick && (
          <Typography
            onClick={onClick}
            variant={'action/small'}
            color={colors['Primary-500']}
            className="cursor-pointer"
          >
            {t('view_more')}
          </Typography>
        )}
        {claim.invitation && StatusShowCountDownMap.has(claim.status) && (
          <span>
            <Typography variant="subtitle/regular" className="!mt-1">
              {t('shift-claim-details:time_remaining')}:
            </Typography>
            <Countdown expirationTime={claim.invitationExpirationTime} />
          </span>
        )}
      </div>
    </div>
  );
};

const StatusShowCountDownMap = new Map<ClaimStatus, boolean>([
  [ClaimStatus.PENDING_PRO_ACCEPT, true],
  [ClaimStatus.INVITATION_EXPIRED, true],
]);
