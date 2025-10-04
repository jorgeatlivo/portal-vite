import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress, Typography } from '@mui/material';
import { IconHeartHandshake } from '@tabler/icons-react';

import { fetchClaimInfoAction } from '@/store/actions/claimActions';
import { RootState } from '@/store/types';

import LivoIcon from '@/components/common/LivoIcon';
import { LivoCVModal } from '@/components/curriculum/LivoCVModal';
import { useLivoCVModal } from '@/components/curriculum/useLivoCVModal';
import OnboardingShiftSection from '@/components/shiftDetails/OnboardingShiftSection';

import { ClaimStatus, SlotReason } from '@/types/claims';

import colors from '@/config/color-palette';
import { ManageClaimContainer } from './ManageClaimContainer';
import { ProfessionalCardHeader } from './ProfessionalCardHeader';
import { ProfessionalCVSummary } from './ProfessionalCVSummary';
import { ProfessionalFacilityExperience } from './ProfessionalFacilityExperience';
import { ProfessionalLivoReviews } from './ProfessionalLivoReviews';
import { ProfessionalDataBody } from './ProfessionalProfileDataBody';
import { SlotReasonDetails } from './SlotReasonDetails';

interface ProfessionalClaimDetailsProps {
  isInvitation?: boolean;
  shiftId: number;
  claimId: number;
  goBack: () => void;
  onAccept: () => void;
  onReject: () => void;
  onUpdateSlotReason: (slotReason: SlotReason) => void;
}
export const ProfessionalClaimDetails: React.FC<
  ProfessionalClaimDetailsProps
> = ({
  shiftId,
  claimId,
  goBack,
  onAccept,
  onReject,
  onUpdateSlotReason,
  isInvitation,
}) => {
  const { t } = useTranslation(['professional-claim', 'shift-claim-details']);
  const { claimRequest, isLoading } = useSelector(
    (state: RootState) => state.claimData
  );
  const dispatch = useDispatch();
  const livoCVModal = useLivoCVModal(claimRequest?.professionalProfile?.id);

  useEffect(() => {
    dispatch(fetchClaimInfoAction(shiftId, claimId) as any);
  }, [dispatch, shiftId, claimId]);

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        onClick={goBack}
        className="mb-small flex w-full items-center justify-start gap-2 px-small"
      >
        <LivoIcon name="arrow-left" size={24} color={colors['Grey-400']} />
      </button>
      {isLoading ? (
        <div className="flex h-full flex-1 items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="no-scrollbar flex h-full flex-col overflow-y-auto pb-14">
          <div className="flex w-full flex-col">
            <ProfessionalCardHeader
              professionalProfile={claimRequest.professionalProfile}
              modality={claimRequest.modality}
            />
            <ProfessionalDataBody
              claim={claimRequest}
              onViewLivoCV={livoCVModal.showModal}
            />
          </div>

          <hr className="w-full border-t border-Divider-Default" />

          {claimRequest.professionalProfile?.cvSummary && (
            <ProfessionalCVSummary
              cvSummary={claimRequest.professionalProfile.cvSummary}
            />
          )}

          {!!claimRequest?.onboardingShift && (
            <div className="flex w-full flex-col gap-4 p-medium">
              <div className="flex items-center gap-2">
                <IconHeartHandshake size={24} color={colors['Neutral-400']} />
                <Typography variant="body1">
                  {t('shift-claim-details:onboarding_shift_requested')}
                </Typography>
              </div>
              <OnboardingShiftSection
                title={t('shift-claim-details:onboarding_shift_title')}
                claimShift={claimRequest.onboardingShift}
              />
            </div>
          )}

          <ProfessionalFacilityExperience
            professionalProfile={claimRequest.professionalProfile}
            shiftId={shiftId}
            claimId={claimId}
          />

          {!!claimRequest.professionalProfile.professionalReview
            ?.averageRating && (
            <ProfessionalLivoReviews
              review={claimRequest.professionalProfile.professionalReview}
              noPadding={false}
            />
          )}

          {claimRequest.status !== ClaimStatus.PENDING_APPROVAL &&
          claimRequest.slotReasonOptions &&
          !isInvitation &&
          claimRequest.slotReasonOptions.length > 0 ? (
            <SlotReasonDetails
              onUpdateSlotReason={onUpdateSlotReason}
              slotReason={claimRequest.slotReason}
              slotReasonOptions={claimRequest.slotReasonOptions}
              claimId={claimId}
              shiftId={shiftId}
              slotReasonCommentDisplayed={
                claimRequest.slotReasonCommentDisplayed
              }
            />
          ) : null}

          {claimRequest.status === ClaimStatus.PENDING_APPROVAL ? (
            <div className="mt-large flex w-full flex-col px-medium">
              <ManageClaimContainer
                onAccept={onAccept}
                onReject={onReject}
              ></ManageClaimContainer>
            </div>
          ) : null}

          {livoCVModal.livoCVDetails && (
            <LivoCVModal
              fullScreen
              style={{ width: '100%', maxWidth: '600px' }}
              title={t('professional_livo_cv_title', {
                fullName: `${claimRequest.professionalProfile?.firstName} ${claimRequest.professionalProfile?.lastName}`,
              })}
              isOpen={livoCVModal.isOpen}
              onClose={livoCVModal.hideModal}
              livoCVDetails={livoCVModal.livoCVDetails}
            />
          )}
        </div>
      )}
    </div>
  );
};
