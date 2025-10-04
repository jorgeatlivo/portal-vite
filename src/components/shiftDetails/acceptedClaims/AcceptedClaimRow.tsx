import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';

import { markdown } from '@/utils/markdown';

import colors from '@/config/color-palette';
import { getDate } from '@/utils';
import { TagLabel } from '../../../components/common/TagLabel';
import { ShiftModalityEnum } from '../../../types';
import { ClaimRequest } from '../../../types/claims';
import LivoIcon, { DisclaimerIconMap } from '../../common/LivoIcon';
import { ProfilePicture } from '../ProfilePicture';

interface AcceptedClaimRowProps {
  claim: ClaimRequest;
  onClick: () => void;
}

export const AcceptedClaimRow: React.FC<AcceptedClaimRowProps> = ({
  claim,
  onClick,
}) => {
  const { t } = useTranslation(['shift-claim-details', 'professional-claim']);
  const {
    professionalProfile,
    cancellationRequest,
    compensationOption,
    modality,
    disclaimer,
    onboardingShift,
  } = claim ?? {};

  const renderSubtitle = (_claim: ClaimRequest) => {
    if (modality === ShiftModalityEnum.EXTERNAL || !modality) {
      const { firstShifterForFacility, professionalReview } =
        _claim?.professionalProfile ?? {};
      if (firstShifterForFacility) {
        return (
          <Typography variant="info/caption">
            {t('professional-claim:first_shifter_label')}
          </Typography>
        );
      }

      if (professionalReview?.totalReviews > 0) {
        return (
          <div className=":hovered:bg-Background-Secondary flex w-full flex-row items-center justify-start space-x-tiny">
            <LivoIcon
              size={12}
              name="star-filled"
              color={colors['Orange-400']}
            />
            <Typography variant="body/small">
              {professionalReview?.averageRating}
            </Typography>
            <Typography variant="body/small" color={colors['Text-Subtle']}>
              {t('professional-claim:review_label', {
                count: professionalReview?.totalReviews,
              })}
            </Typography>
          </div>
        );
      }

      return (
        <Typography variant="info/caption" color={colors['Text-Subtle']}>
          {t('no_reviews_label')}
        </Typography>
      );
    }

    if (cancellationRequest) {
      return (
        <Typography variant="info/caption" color={colors['Negative-500']}>
          {t('cancellation_request')}
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
              backgroundColor={
                tag.styling?.backgroundColor || colors['Neutral-100']
              }
              color={tag.styling?.textColor || undefined}
            />
          ))}
        </div>
        {compensationOption && (
          <Typography variant="info/caption" color={colors['Text-Subtle']}>
            {compensationOption?.label}: {compensationOption.compensationValue}
          </Typography>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className="flex size-full cursor-pointer flex-row items-center space-x-medium rounded-[6px] p-small hover:bg-Background-Secondary"
    >
      <ProfilePicture
        profilePictureUrl={professionalProfile?.profilePictureUrl}
        modality={modality}
        size={48}
      />
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-row items-center space-x-small">
          <Typography
            variant="subtitle/regular"
            className="truncate !font-semibold text-Text-Default"
          >
            {`${professionalProfile?.firstName} ${professionalProfile?.lastName}`}
          </Typography>

          {disclaimer ? (
            <div className="group relative">
              <LivoIcon
                name={DisclaimerIconMap[disclaimer.type].name}
                color={DisclaimerIconMap[disclaimer.type].color}
                size={18}
              />
              <div className="invisible absolute left-0 top-full z-10 mt-2 w-[200px] whitespace-normal rounded bg-Grey-950 px-2 py-1 text-white group-hover:visible">
                <div className="flex flex-col space-y-2 text-left text-s01">
                  <span>{disclaimer.message}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {renderSubtitle(claim)}
        {onboardingShift && (
          <Typography variant="body/regular">
            {markdown(
              `***${t('onboarding_shift_title')}*** ${getDate(onboardingShift?.startTime, 'D MMMM HH:mm[h]')} - ${getDate(onboardingShift?.finishTime, 'HH:mm[h]')}`
            )}
          </Typography>
        )}
      </div>

      <LivoIcon size={24} name="chevron-right" color={colors['Primary-500']} />
    </div>
  );
};
