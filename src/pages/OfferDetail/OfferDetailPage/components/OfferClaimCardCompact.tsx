import clsx from 'clsx';

import { ProfessionalRatingStar } from '@/components/common/ProfessionalRatingStar';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import { OfferClaim } from '@/types/offers';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { OfferClaimStatusTag } from './OfferStatusTag';
import { SkillTagsCompact } from './SkillTagsCompact';

interface OfferClaimCardCompactProps {
  claim: OfferClaim;
  isSelected: boolean;
  selectClaim: (claimId: OfferClaim) => void;
}

export const OfferClaimCardCompact: React.FC<OfferClaimCardCompactProps> = ({
  claim,
  isSelected,
  selectClaim,
}) => {
  return (
    <div className="relative">
      <div
        ref={(node) => {
          if (node && isSelected) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
        onClick={() => selectClaim(claim)}
        className={clsx(
          'relative flex min-w-[200px] max-w-screen-xl cursor-pointer  flex-row items-center rounded-[8px] p-small',
          isSelected
            ? 'bg-Action-Secondary text-Text-Inverse shadow-md'
            : 'bg-white shadow-sm hover:shadow-md'
        )}
      >
        <div className="inline-flex flex-1 items-start justify-start gap-2 rounded-lg">
          <div className="flex shrink grow basis-0 items-start justify-start gap-4">
            <div className="relative size-12 rounded-lg">
              <ProfilePicture
                profilePictureUrl={claim.professionalProfile.profilePictureUrl}
                size={48}
                modality={claim.zombieClaim ? null : ShiftModalityEnum.EXTERNAL}
                style={{
                  filter: claim.zombieClaim ? 'blur(6px)' : 'none',
                }}
              />
            </div>
            <div className="flex min-h-20 shrink grow basis-0 items-start justify-start gap-2">
              <div className="inline-flex shrink grow basis-0 flex-col items-start justify-center gap-2">
                <div className="w-48 font-['Roboto'] text-base font-normal leading-normal">
                  <p
                    className={`subtitle-regular ${claim.zombieClaim ? 'blur-content' : ''}`}
                  >
                    {claim.professionalProfile.fullName}
                  </p>
                </div>
                <div className="inline-flex w-44 items-start justify-start gap-1">
                  <SkillTagsCompact skills={claim.professionalProfile.skills} />
                </div>
                {claim.professionalProfile.professionalReview && (
                  <div className="inline-flex items-center justify-start gap-1">
                    <ProfessionalRatingStar
                      professionalReview={
                        claim.professionalProfile.professionalReview
                      }
                      textColor={
                        isSelected ? colors['Text-Inverse'] : undefined
                      }
                    />
                  </div>
                )}
              </div>
              <div className="inline-flex w-20 flex-row items-start justify-center gap-2 self-stretch">
                <div className="inline-flex w-fit items-center justify-end gap-2.5">
                  <OfferClaimStatusTag status={claim.status} />
                  <div>
                    {(claim.newClaim || claim.newScreeningSummary) && (
                      <div className="flex items-center justify-center">
                        <div className="size-2 rounded-full bg-Primary-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
