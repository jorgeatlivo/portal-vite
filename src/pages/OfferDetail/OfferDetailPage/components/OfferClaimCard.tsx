import { Tooltip } from '@mui/material';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import { ProfessionalRatingStar } from '@/components/common/ProfessionalRatingStar';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import { OfferClaim } from '@/types/offers';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { OfferClaimStatusTag } from './OfferStatusTag';
import { SkillTagsCompact } from './SkillTagsCompact';

interface OfferClaimCardProps {
  claim: OfferClaim;
  isSelected: boolean;
  selectClaim: (claimId: OfferClaim) => void;
}

export const OfferClaimCard: React.FC<OfferClaimCardProps> = ({
  claim,
  isSelected,
  selectClaim,
}) => {
  return (
    <div
      onClick={() => selectClaim(claim)}
      className={clsx(
        'relative flex  cursor-pointer flex-row items-center rounded-[16px] p-small',
        isSelected
          ? 'bg-Action-Secondary text-Text-Inverse shadow-md'
          : 'bg-white shadow-sm hover:shadow-md'
      )}
      style={{
        minWidth: '200px',
      }}
    >
      <div className="grid w-full flex-1 grid-cols-10 items-center justify-between space-x-small">
        <div className="col-span-2 flex text-left">
          <Tooltip
            placement="bottom"
            title={claim.professionalProfile.fullName}
            disableHoverListener={claim.zombieClaim}
            enterDelay={200}
            enterNextDelay={200}
          >
            <div className="flex flex-row items-center gap-2 space-x-small">
              <ProfilePicture
                profilePictureUrl={claim.professionalProfile.profilePictureUrl}
                size={48}
                modality={claim.zombieClaim ? null : ShiftModalityEnum.EXTERNAL}
                style={{
                  filter: claim.zombieClaim ? 'blur(6px)' : 'none',
                }}
              />
              <Typography
                variant={'subtitle/regular'}
                className={`max-w-[140px] truncate ${claim.zombieClaim ? 'blur-content' : ''}`}
              >
                {claim.professionalProfile.fullName}
              </Typography>
            </div>
          </Tooltip>
        </div>
        <div className="col-span-3 ml-5 flex flex-wrap items-end gap-1">
          <SkillTagsCompact
            skills={claim.professionalProfile.skills}
            flexWrap={true}
          />
        </div>

        <Tooltip
          placement="bottom"
          disableHoverListener={claim.zombieClaim}
          enterDelay={200}
          enterNextDelay={200}
          title={
            <div className="flex flex-col gap-2 p-1">
              {claim.professionalProfile.cvSummary?.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          }
        >
          <div className="w-15 col-span-3 flex text-left">
            <Typography
              variant={'body/small'}
              className="line-clamp-2 h-8 overflow-hidden"
            >
              {claim.professionalProfile.cvSummary}
            </Typography>
          </div>
        </Tooltip>

        {claim.professionalProfile.professionalReview && (
          <div className="col-span-1 flex w-full flex-row items-center justify-start space-x-tiny">
            <div className="flex w-full flex-1 items-center justify-center">
              <ProfessionalRatingStar
                professionalReview={
                  claim.professionalProfile.professionalReview
                }
                textColor={isSelected ? colors['Text-Inverse'] : undefined}
              />
            </div>
          </div>
        )}

        <div className="col-span-1 flex w-full flex-row items-center justify-start space-x-tiny">
          <div className="flex w-full flex-1 items-center justify-center">
            <OfferClaimStatusTag status={claim.status} />
          </div>
        </div>
      </div>
      <div className="w-[20px]">
        {(claim.newClaim || claim.newScreeningSummary) && (
          <div className="ml-tiny flex items-center justify-center">
            <div className="size-2 rounded-full bg-Primary-500" />
          </div>
        )}
      </div>
    </div>
  );
};
