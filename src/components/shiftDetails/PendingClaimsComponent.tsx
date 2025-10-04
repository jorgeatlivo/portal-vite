import { useTranslation } from 'react-i18next';

import { IconAlertTriangle } from '@tabler/icons-react';

import { Typography } from '@/components/atoms/Typography';
import ClaimStatusView from '@/components/shiftDetails/ClaimStatus';
import OnboardingShiftSection from '@/components/shiftDetails/OnboardingShiftSection';
import { ShiftCardTag } from '@/components/shifts/ShiftCardTag';

import { ClaimRequest, ClaimStatus } from '@/types/claims';
import { markdown } from '@/utils/markdown';

import { AcceptButton } from './AcceptButton';
import { ClaimRow } from './ClaimRow';
import OpenFavoriteProfessionals from './professionalClaim/OpenFavoriteProfessionals';
import { RejectButton } from './RejectButton';

interface PendingClaimsComponentProps {
  claims?: ClaimRequest[];
  rejectingClaimId?: number;
  onAccept: (claimId: ClaimRequest) => void;
  onReject: (claimId: number) => void;
  selectClaim: (claim: ClaimRequest) => void;
  isLoading?: boolean;
}

export const PendingClaimsComponent: React.FC<PendingClaimsComponentProps> = ({
  claims,
  rejectingClaimId,
  onAccept,
  onReject,
  selectClaim,
  isLoading = false,
}) => {
  const { t } = useTranslation([
    'shift-claim-details',
    'professionals/favorite',
    'calendar',
  ]);

  const hasOnboardingClaims =
    claims?.some((claim) => !!claim.onboardingShift) || false;

  const notchCount =
    claims?.filter((claim) => PendingApprovalClaimStatuses.has(claim.status))
      .length ?? 0;

  return (
    <div className="flex w-full min-w-fit flex-col gap-2 px-5">
      <div className="flex items-center space-x-tiny">
        <Typography
          variant="heading/medium"
          className="!font-semibold text-2xl leading-8 text-Text-Default"
        >
          {t('pending_claims_title')}
        </Typography>
        {notchCount > 0 && (
          <ShiftCardTag isFilled={false} totalPendingClaims={notchCount} />
        )}
      </div>

      {hasOnboardingClaims && (
        <Typography variant="body/regular">
          {markdown(t('confirm_onboarding_shift_fit_time_note'))}
        </Typography>
      )}

      {claims && claims.length > 0 ? (
        <div className="flex w-full flex-1 flex-col justify-start space-y-small">
          {claims.map((claim) => {
            return (
              <div
                key={`shift-claim-${claim.id}`}
                className="relative flex w-full flex-col gap-2 rounded-lg bg-white p-medium"
              >
                <div className="absolute right-3">
                  <ClaimStatusView status={claim.status} />
                </div>

                <div className="flex w-full items-center justify-between space-x-small">
                  <ClaimRow claim={claim} onClick={() => selectClaim(claim)} />
                  {!claim.invitation && (
                    <div className="flex flex-row items-center justify-center space-x-small">
                      <AcceptButton
                        onClick={() => {
                          onAccept(claim);
                        }}
                        isDisabled={false}
                        isLoading={isLoading}
                      />
                      <RejectButton
                        onClick={() => {
                          onReject(claim.id);
                        }}
                        isDisabled={false}
                        isLoading={rejectingClaimId === claim.id}
                      />
                    </div>
                  )}
                </div>

                {!!claim.noOnboardingClaimReason && (
                  <div className="flex gap-2">
                    <IconAlertTriangle
                      size={24}
                      className="text-Action-Notification"
                    />
                    <Typography
                      variant="body/regular"
                      className="text-Text-Default"
                    >
                      {markdown(claim.noOnboardingClaimReason)}
                    </Typography>
                  </div>
                )}

                {claim.onboardingShift && (
                  <OnboardingShiftSection
                    title={t('onboarding_shift_title')}
                    claimShift={claim.onboardingShift}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-scrollbar flex h-full flex-1 flex-col space-y-large  overflow-y-auto">
          <Typography variant="body/small" className="text-Text-Subtle">
            {t('professionals/favorite:searching_professionals_description')}
          </Typography>

          <OpenFavoriteProfessionals />
        </div>
      )}
    </div>
  );
};

const PendingApprovalClaimStatuses = new Map<ClaimStatus, boolean>([
  [ClaimStatus.PENDING_APPROVAL, true],
]);
