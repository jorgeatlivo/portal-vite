import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { ClaimRequest, ClaimStatus } from '@/types/claims';
import { ShiftTimeStatusEnum } from '@/types/shifts';

import colors from '@/config/color-palette';
import { CancelInternalProfessionalClaimModal } from './CancelInternalProfessionalClaimModal';
import { CompensationOptionComponent } from './CompensationOption';
import { InternalProfessionalAttributes } from './InternalProfileAttributes';
import { ManageClaimContainer } from './ManageClaimContainer';
import { ProfessionalCardHeader } from './ProfessionalCardHeader';
import { SlotReasonDetails } from './SlotReasonDetails';

interface InternalProfessionalClaimDetailsProps {
  claim: ClaimRequest;
  goBack: () => void;
  onAccept: () => void;
  onReject: () => void;
  acceptCancellationRequest: (claimId: number) => void;
  rejectCancellationRequest: (claimID: number) => void;
  onUpdateSlotReason: () => void;
  shiftId: number;
  onDelete: (reason: string) => void;
  shiftStatus: ShiftTimeStatusEnum;
}
export const InternalProfessionalClaimDetails: React.FC<
  InternalProfessionalClaimDetailsProps
> = ({
  claim,
  goBack,
  onAccept,
  onReject,
  acceptCancellationRequest,
  rejectCancellationRequest,
  onUpdateSlotReason,
  shiftId,
  onDelete,
  shiftStatus,
}) => {
  const { t } = useTranslation('shift-claim-details');
  const [menuOpen, setMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setCancelModalOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleConfirmDelete = (reason: string) => {
    onDelete(reason);
  };

  return (
    <div className="no-scrollbar flex w-full flex-col">
      <div className="flex w-full items-center justify-between px-large">
        <button type="button" onClick={goBack}>
          <LivoIcon size={24} name="arrow-left" color={colors['Grey-700']} />
        </button>
        {shiftStatus === ShiftTimeStatusEnum.UPCOMING && (
          <div className="relative">
            <button
              type="button"
              ref={buttonRef}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }}
            >
              <LivoIcon size={24} name="dots" color={colors['Grey-700']} />
            </button>

            {menuOpen && (
              <div
                ref={modalRef}
                className="absolute right-full top-0 z-10 mb-[14px] mr-tiny w-[240px] space-y-[14px] rounded-[8px] bg-white p-large shadow-custom"
              >
                <button
                  type="button"
                  className="pv-tiny flex w-full items-center justify-between px-small"
                  onClick={() => {
                    setCancelModalOpen(true);
                  }}
                >
                  <Typography
                    variant={'body/regular'}
                    color={colors['Negative-500']}
                  >
                    {t('revoke_position')}
                  </Typography>
                  <LivoIcon
                    size={24}
                    name="circle-minus"
                    color={colors['Red-500']}
                  />
                </button>

                <CancelInternalProfessionalClaimModal
                  isOpen={cancelModalOpen}
                  onClose={() => setCancelModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                  claim={claim}
                  shiftId={shiftId}
                  goBack={goBack}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex size-full flex-col justify-between pb-large">
        <div className="no-scrollbar flex size-full flex-col space-y-large divide-y divide-Divider-Default overflow-y-scroll">
          <div className="flex w-full flex-col">
            <ProfessionalCardHeader
              professionalProfile={claim.professionalProfile}
              modality={claim.modality}
            />
            {claim.professionalProfile.internal && (
              <InternalProfessionalAttributes
                attributes={[
                  ...claim.professionalProfile.internal.dataFields.map(
                    (datafield) => ({
                      label: datafield.label,
                      value: datafield.displayText,
                    })
                  ),
                ]}
              />
            )}
          </div>
          {claim.compensationOption && (
            <CompensationOptionComponent
              compensationOption={claim.compensationOption}
            />
          )}
          {claim.status !== ClaimStatus.PENDING_APPROVAL &&
          claim.slotReasonOptions &&
          claim.slotReasonOptions.length > 0 ? (
            <SlotReasonDetails
              onUpdateSlotReason={onUpdateSlotReason}
              slotReason={claim.slotReason}
              slotReasonOptions={claim.slotReasonOptions}
              claimId={claim.id}
              shiftId={shiftId}
              slotReasonCommentDisplayed={claim.slotReasonCommentDisplayed}
            />
          ) : null}
        </div>
        <div className="flex w-full flex-col">
          {claim.status === ClaimStatus.PENDING_APPROVAL ? (
            <div className="flex w-full flex-col px-medium">
              <ManageClaimContainer
                onAccept={onAccept}
                onReject={onReject}
              ></ManageClaimContainer>
            </div>
          ) : claim.cancellationRequest ? (
            <div className="mb-large flex w-full flex-col px-medium">
              <ManageClaimContainer
                onAccept={() => acceptCancellationRequest(claim.id)}
                onReject={() => rejectCancellationRequest(claim.id)}
              >
                <div className="flex w-full flex-col space-y-tiny">
                  <Typography
                    variant="body/regular"
                    color={colors['Text-Subtle']}
                  >
                    {t('cancellation_request_reason')}
                  </Typography>
                  <Typography
                    variant="body/regular"
                    color={colors['Text-Default']}
                  >
                    {claim.cancellationRequest.reason}
                  </Typography>
                </div>
              </ManageClaimContainer>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
