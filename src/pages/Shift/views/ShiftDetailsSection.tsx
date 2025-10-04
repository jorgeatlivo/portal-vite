import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { CircularProgress, Divider } from '@mui/material';
import clsx from 'clsx';

import { handleApiError, isDenarioNotSyncedError } from '@/services/api';
import {
  shiftCancellationAccept,
  shiftCancellationResolve,
  shiftClaimReject,
} from '@/services/claims';
import { Logger } from '@/services/logger.service';
import {
  cancelShiftRequest,
  updateCapacityRequest,
} from '@/services/shifts-calendar';
import { fetchActivity } from '@/store/actions/activityShiftListActions';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import ConfirmOnboardingShiftModal from '@/components/common/modal/ConfirmOnboardingShiftModal/ConfirmOnboardingShiftModal';
import { AcceptedClaimsComponent } from '@/components/shiftDetails/AcceptedClaimsComponent';
import { CancelShiftModal } from '@/components/shiftDetails/CancelShiftModal';
import { CancelShiftReasonsModal } from '@/components/shiftDetails/CancelShiftReasonsModal';
import { usePostContactLivoOnboardingShift } from '@/components/shiftDetails/hooks/usePostContactLivoOnboardingShift';
import { MissedClaimsComponent } from '@/components/shiftDetails/MissedClaimsComponent';
import { PendingClaimsComponent } from '@/components/shiftDetails/PendingClaimsComponent';
import { AcceptProfessionalWithClaimReason } from '@/components/shiftDetails/professionalClaim/AcceptProfessionalWithClaimReason';
import { InternalProfessionalClaimDetails } from '@/components/shiftDetails/professionalClaim/InternalProfessionalClaimDetails';
import { ProfessionalClaimDetails } from '@/components/shiftDetails/professionalClaim/ProfessionalClaimDetails';
import { RejectProfessionalReasonsModal } from '@/components/shiftDetails/RejectProfessionalReasonsModal';
import { ShiftDetailsBody } from '@/components/shiftDetails/ShiftDetailsBody';
import { ShiftDetailsHeader } from '@/components/shiftDetails/ShiftDetailsHeader';

import useDialog from '@/hooks/use-dialog';
import { useModal } from '@/hooks/use-modal';
import { ClaimRequest, ClaimStatus, DenarioErrorPayload } from '@/types/claims';
import { ShiftOnboarding } from '@/types/onboarding';
import { Shift, ShiftTimeStatusEnum } from '@/types/shifts';
import { wait } from '@/utils/frame';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import { useShiftContext } from '@/contexts/ShiftContext';
import useFetchShiftDetail from '@/pages/Shift/hooks/useFetchShiftDetail';
import { useMutateClaims } from '@/pages/Shift/hooks/useMutateClaims';
import { AppDispatch } from '@/store';
import { ShiftModalityEnum } from '@/types';

const DEFAULT_WIDTH = '60%';
const FULLY_BOOKED_WIDTH = '30%';
const HIDDEN_WIDTH = '0%';

export const ShiftDetailsSection = ({
  reloadShifts,
  extraColumn,
}: {
  reloadShifts: () => void;
  extraColumn?: boolean;
}) => {
  const { state, pathname } = useLocation();
  const { t } = useTranslation(['shift-claim-details', 'common']);
  const {
    selectedShiftId,
    setSelectedShiftId,
    selectedClaimId,
    setSelectedClaimId,
  } = useShiftContext();
  const { isLoading, refetch, shiftDetails } =
    useFetchShiftDetail(selectedShiftId);
  const { acceptClaimAsync, isPending: isPendingAccept } = useMutateClaims();
  const { openModal, closeModal } = useModal();
  const isOpeningContactDialogRef = useRef(false);
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const { contactLivo } = usePostContactLivoOnboardingShift();
  const { handleUncaughtError } = useUncaughtErrorHandler();

  const [cancelShiftModalOpen, setCancelShiftModalOpen] = useState(false);
  const [removeCapacityModalOpen, setRemoveCapacityModalOpen] = useState(false);

  const [rejectingClaimId, setRejectingClaimId] = useState<number | null>(null);
  const [selectedSlotReasonClaimId, setSelectedSlotReasonClaimId] = useState<
    number | null
  >(null);
  const dispatch = useDispatch<AppDispatch>();
  const selectedClaim = useMemo(
    () => shiftDetails?.claims?.find((claim) => claim.id === selectedClaimId),
    [selectedClaimId, shiftDetails?.claims]
  );
  const selectedSlotClaim = useMemo(
    () =>
      shiftDetails?.claims?.find(
        (claim) => claim.id === selectedSlotReasonClaimId
      ),
    [selectedSlotReasonClaimId, shiftDetails?.claims]
  );
  const [selectedOption, setSelectedOption] = useState('professionals');
  const [denarioError, setDenarioError] = useState<DenarioErrorPayload | null>(
    null
  );
  const [currentAction, setCurrentAction] = useState<{
    shiftId: number;
    claimId: number;
    actionType: 'accept' | 'reject' | 'cancelAccept';
    reason?: string;
    details?: string;
    skipConstraints?: boolean;
  } | null>(null);
  const [retryingActionWithDenario, setRetryingActionWithDenario] =
    useState(false);
  const [actionWithoutDenario, setActionWithoutDenario] = useState(false);

  useEffect(() => {
    setSelectedClaimId(null);
    setSelectedOption('professionals');
  }, [selectedShiftId, setSelectedClaimId]);

  const handleClaimError = useCallback(
    (error: any) =>
      error.response.data.errorMessage
        ? dispatch(
            showToastAction({
              message: error.response.data.errorMessage,
              severity: 'error',
            })
          )
        : handleApiError(error),
    [dispatch]
  );

  const onClickCreateShift = useCallback(
    (shift?: Shift) => {
      const params = new URLSearchParams(window.location.search);
      params.set('action', 'create-shift');
      navigate({ search: `?${params.toString()}` }, { state: { shift } });
    },
    [navigate]
  );

  const onClickEditShift = useCallback(
    (shift?: Shift) => {
      const params = new URLSearchParams(window.location.search);
      params.set('action', 'edit-shift');
      params.set('shift-id', shift?.id.toString() || '');
      navigate({ search: `?${params.toString()}` }, { state: { shift } });
    },
    [navigate]
  );

  const pendingClaims = useMemo(
    () =>
      shiftDetails?.claims?.filter((claim) =>
        PendingClaimStatuses.has(claim.status)
      ),
    [shiftDetails?.claims]
  );

  const missedClaims = useMemo(
    () =>
      shiftDetails?.claims?.filter((claim) =>
        MissedClaimStatuses.has(claim.status)
      ) ?? [],
    [shiftDetails?.claims]
  );

  const isShiftFullyBooked =
    shiftDetails?.totalAcceptedClaims === shiftDetails?.capacity;

  const [previousWidth, setPreviousWidth] = useState<string>(DEFAULT_WIDTH);

  const getFlexWidth = () => {
    if (!selectedShiftId) return HIDDEN_WIDTH;
    if (window.innerWidth <= 768) return '100%';
    if (!shiftDetails) return previousWidth;
    if ((selectedClaimId && isShiftFullyBooked) || !isShiftFullyBooked)
      return DEFAULT_WIDTH;
    return FULLY_BOOKED_WIDTH;
  };

  const flex = getFlexWidth();

  useEffect(() => {
    if (shiftDetails && selectedShiftId) {
      let newWidth;
      if ((selectedClaimId && isShiftFullyBooked) || !isShiftFullyBooked) {
        newWidth = DEFAULT_WIDTH;
      } else {
        newWidth = FULLY_BOOKED_WIDTH;
      }
      setPreviousWidth(newWidth);
    }
  }, [shiftDetails, selectedShiftId, isShiftFullyBooked, selectedClaimId]);

  const onAcceptClaim = useCallback(
    async (
      shiftId: number,
      claimId: number,
      skipConstraints?: boolean,
      reason?: string
    ) => {
      try {
        await acceptClaimAsync({
          shiftId,
          shiftClaimId: claimId,
          reason,
          comment: undefined,
          skipConstraints,
        });

        dispatch(fetchActivity());
        refetch();
        reloadShifts();
        setRetryingActionWithDenario(false);
        setActionWithoutDenario(false);
        setDenarioError(null);
      } catch (error: any) {
        setRetryingActionWithDenario(false);
        setActionWithoutDenario(false);
        if (isDenarioNotSyncedError(error.response.data)) {
          const extraData = error.response.data
            .extraData as DenarioErrorPayload;
          setDenarioError(extraData);
          setCurrentAction({ shiftId, claimId, actionType: 'accept' });
        } else {
          handleClaimError(error);
        }
      }
    },
    [acceptClaimAsync, dispatch, handleClaimError, refetch, reloadShifts]
  );

  const acceptClaim = useCallback(
    async (
      shift?: Shift | null,
      claim?: ClaimRequest,
      skipConstraints?: boolean
    ) => {
      if (!shift || !claim) {
        return;
      }

      const shouldShowConfirmPopup = !!claim?.onboardingShift;
      const { onboardingShift, slotReasonOptions } = claim;

      /**
       * handle onboarding shift confirmation
       */
      if (shouldShowConfirmPopup) {
        const coverage: ShiftOnboarding = {
          startTime: shift.startTime,
          finishTime: shift.finishTime,
          specialization: shift.specialization.displayText,
          shiftTimeInDay: shift.shiftTimeInDay,
          price: '',
        };
        const modalContent = (
          <ConfirmOnboardingShiftModal
            claimId={claim.id}
            onboardingShift={onboardingShift}
            coverageShift={coverage}
            slotReasonOptions={slotReasonOptions}
            onConfirm={(reason) => {
              onAcceptClaim(shift.id, claim.id, skipConstraints, reason);
            }}
          />
        );
        openModal(modalContent);

        return;
      }

      /**
       * handle slot reason options
       */
      if (Array.isArray(slotReasonOptions) && slotReasonOptions.length > 0) {
        setSelectedSlotReasonClaimId(claim.id);
        return;
      }

      /**
       * accept claim
       */
      await onAcceptClaim(shift.id, claim.id, skipConstraints);
    },
    [onAcceptClaim, openModal]
  );

  const handleDialogConfirm = useCallback(() => {
    navigate(pathname, { state: undefined });
    isOpeningContactDialogRef.current = false;
  }, [navigate, pathname]);

  /**
   * open contact dialog if the state is "contact-us"
   * and the dialog is not already being opened
   */
  useEffect(() => {
    if (
      typeof state !== 'string' ||
      !state.startsWith('contact-us') ||
      isOpeningContactDialogRef.current
    ) {
      return;
    }

    const claimIdStr = state.split('__')[1] || null;
    const claimId = claimIdStr ? parseInt(claimIdStr, 10) : null;
    isOpeningContactDialogRef.current = true;

    /**
     * close current modal if it is open
     * to avoid conflicts with the contact dialog
     */
    closeModal();

    if (typeof selectedShiftId === 'number') {
      contactLivo({
        coverageShiftId: selectedShiftId,
        coverageShiftClaimId: Number.isFinite(claimId) ? claimId : undefined,
      });
    }

    wait(300).then(() => {
      // clear states
      navigate(pathname, { state: undefined });
      isOpeningContactDialogRef.current = false;
      openDialog({
        title: t('onboarding_shift_contact_title'),
        content: t('onboarding_shift_contact_description'),
        dialogType: 'info',
        singleOption: true,
        confirmLabel: t('onboarding_shift_contact_confirm_btn'),
        onConfirm: handleDialogConfirm,
      });
    });
  }, [
    closeModal,
    contactLivo,
    handleDialogConfirm,
    navigate,
    openDialog,
    pathname,
    selectedShiftId,
    state,
    t,
  ]);

  const rejectClaim = useCallback(
    async (
      shiftId: number,
      claimId: number,
      reason: string,
      details: string,
      skipConstraints?: boolean
    ) =>
      shiftClaimReject(shiftId, claimId, reason, details, skipConstraints)
        .then(() => {
          setRejectingClaimId(null);
          setSelectedClaimId(null);
          refetch();
          reloadShifts();
          setRetryingActionWithDenario(false);
          setActionWithoutDenario(false);
          setDenarioError(null);
        })
        .catch((error) => {
          setRetryingActionWithDenario(false);
          setActionWithoutDenario(false);
          if (isDenarioNotSyncedError(error.response.data)) {
            const extraData = error.response.data
              .extraData as DenarioErrorPayload;
            setDenarioError(extraData);
            setCurrentAction({
              shiftId,
              claimId,
              actionType: 'reject',
              reason,
              details,
            });
          } else {
            handleClaimError(error);
          }
        }),
    [handleClaimError, refetch, reloadShifts]
  );

  const acceptCancellationRequest = useCallback(
    async function (
      shiftId: number,
      claimId: number,
      skipConstraints?: boolean
    ) {
      shiftCancellationAccept(shiftId, claimId, skipConstraints)
        .then(() => {
          dispatch(fetchActivity());
          refetch();
          reloadShifts();
          setSelectedClaimId(null);
          setRetryingActionWithDenario(false);
          setActionWithoutDenario(false);
          setDenarioError(null);
        })
        .catch((error) => {
          setRetryingActionWithDenario(false);
          setActionWithoutDenario(false);
          if (isDenarioNotSyncedError(error.response.data)) {
            const extraData = error.response.data
              .extraData as DenarioErrorPayload;
            setDenarioError(extraData);
            setCurrentAction({ shiftId, claimId, actionType: 'cancelAccept' });
          } else {
            handleApiError(error);
          }
        });
    },
    [dispatch, refetch, reloadShifts]
  );

  const isRejectModalOpen = useMemo(
    () => rejectingClaimId !== null,
    [rejectingClaimId]
  );
  const returnFromRejectModal = useCallback(
    () => setRejectingClaimId(null),
    []
  );

  return (
    <div
      className={
        'md:transition-width no-scrollbar !md:w-auto md:insets-auto fixed bottom-0 left-0 top-[56px] !m-0 flex min-h-full flex-col overflow-x-hidden overflow-y-scroll bg-BG-Default pb-[60px] ease-in-out md:relative md:top-0 md:overflow-hidden md:pb-0 md:duration-100'
      }
      style={{ minWidth: flex }}
    >
      <div
        className={`flex min-w-fit border-l border-solid border-Divider-Subtle md:size-full`}
      >
        {isLoading && (
          <div className="flex size-full flex-col items-center justify-center">
            <CircularProgress />
          </div>
        )}

        {!isLoading && shiftDetails && (
          <div
            className={`flex flex-1 flex-col divide-x divide-Divider-Default md:h-full md:flex-row`}
          >
            <div
              className={clsx(
                'flex flex-1 flex-col bg-white pb-10 pt-xLarge md:h-screen md:overflow-auto',
                extraColumn ? 'md:max-w-[25vw]' : 'md:max-w-[30vw]'
              )}
            >
              <ShiftDetailsHeader
                enableActions={shiftDetails.shiftActionsAllow}
                onCopy={() => {
                  onClickCreateShift(shiftDetails);
                }}
                onClose={() => {
                  setSelectedShiftId(undefined);
                }}
                onEdit={() => {
                  onClickEditShift(shiftDetails);
                }}
                onDelete={() => {
                  setCancelShiftModalOpen(true);
                }}
                editable={
                  shiftDetails.shiftTimeStatus === ShiftTimeStatusEnum.UPCOMING
                }
                recurrent={shiftDetails.recurrentDates?.length > 1}
              />
              <div className="no-scrollbar flex h-full flex-1 flex-col space-y-large divide-y divide-Divider-Default md:overflow-y-auto">
                <ShiftDetailsBody shift={shiftDetails} />

                <AcceptedClaimsComponent
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  shouldShowSlotReasonList={
                    shiftDetails.shouldShowSlotReasonList
                  }
                  claims={shiftDetails.claims?.filter(
                    (claim) => claim.status === ClaimStatus.APPROVED
                  )}
                  capacity={shiftDetails.capacity}
                  updateCapacity={(newCapacity: number) => {
                    updateCapacityRequest(shiftDetails!.id, newCapacity).then(
                      () => {
                        refetch();
                        reloadShifts();
                      }
                    );
                  }}
                  editable={
                    shiftDetails.shiftTimeStatus ===
                    ShiftTimeStatusEnum.UPCOMING
                  }
                  onDecreaseCapacity={() => {
                    setRemoveCapacityModalOpen(true);
                  }}
                  selectClaim={(claim) => setSelectedClaimId(claim.id)}
                />
              </div>
            </div>

            <Divider className="h-px bg-Divider-Default md:h-0" />
            {/* Second column */}
            {/* accept with claim reason */}
            {selectedSlotClaim && (
              <div className="no-scrollbar flex  size-full flex-1 overflow-y-scroll pt-xLarge">
                <AcceptProfessionalWithClaimReason
                  claim={selectedSlotClaim}
                  goBack={() => {
                    setSelectedSlotReasonClaimId(null);
                  }}
                  onAccept={() => {
                    refetch();
                    reloadShifts();
                    setSelectedSlotReasonClaimId(null);
                  }}
                  handleClaimError={handleClaimError}
                  shiftId={shiftDetails.id}
                />
              </div>
            )}

            {/* profile of professional */}
            {!selectedSlotClaim && selectedClaim && (
              <div
                className={clsx(
                  'fixed inset-0 top-[56px] flex min-w-[300px] flex-1 bg-white pt-xLarge md:static',
                  extraColumn ? 'md:max-w-[25vw]' : 'md:max-w-[30vw]'
                )}
              >
                {selectedClaim.modality === ShiftModalityEnum.INTERNAL && (
                  <InternalProfessionalClaimDetails
                    onUpdateSlotReason={() => {
                      refetch();
                      reloadShifts();
                    }}
                    shiftId={shiftDetails.id}
                    claim={selectedClaim}
                    shiftStatus={shiftDetails.shiftTimeStatus}
                    goBack={() => setSelectedClaimId(null)}
                    onAccept={() => {
                      acceptClaim(shiftDetails, selectedClaim).then(() =>
                        setSelectedClaimId(null)
                      );
                    }}
                    onReject={() => setRejectingClaimId(selectedClaimId)}
                    acceptCancellationRequest={(claimId) => {
                      acceptCancellationRequest(shiftDetails.id, claimId);
                    }}
                    rejectCancellationRequest={(claimId) => {
                      shiftCancellationResolve(shiftDetails.id, claimId).then(
                        () => {
                          dispatch(fetchActivity());

                          refetch();
                          reloadShifts();
                        }
                      );
                    }}
                    onDelete={() => {
                      reloadShifts();
                    }}
                  />
                )}

                {selectedClaim.modality !== ShiftModalityEnum.INTERNAL && (
                  <ProfessionalClaimDetails
                    isInvitation={selectedClaim.invitation}
                    shiftId={shiftDetails.id}
                    claimId={selectedClaim.id}
                    goBack={() => setSelectedClaimId(null)}
                    onAccept={() => {
                      acceptClaim(shiftDetails, selectedClaim).then(() =>
                        setSelectedClaimId(null)
                      );
                    }}
                    onReject={() => setRejectingClaimId(selectedClaimId)}
                    onUpdateSlotReason={() => {
                      refetch();
                      reloadShifts();
                    }}
                  />
                )}
              </div>
            )}

            {/* pending claims */}
            {!selectedSlotClaim && !selectedClaim && !isShiftFullyBooked && (
              <div
                className={clsx(
                  'flex min-w-[280px] flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden bg-BG-Default py-xLarge',
                  extraColumn ? 'md:max-w-[25vw]' : 'md:max-w-[30vw]'
                )}
              >
                <PendingClaimsComponent
                  claims={pendingClaims}
                  onAccept={(claim: ClaimRequest) => {
                    acceptClaim(shiftDetails, claim);
                  }}
                  onReject={(claimId: number) => {
                    dispatch(fetchActivity());
                    setRejectingClaimId(claimId);
                  }}
                  selectClaim={(claim) => {
                    setSelectedClaimId(claim.id);
                  }}
                  isLoading={isPendingAccept}
                  rejectingClaimId={rejectingClaimId || undefined}
                />
                {/* missed (rejected/expired) claims */}
                {missedClaims.length > 0 && (
                  <MissedClaimsComponent claims={missedClaims} />
                )}
              </div>
            )}
          </div>
        )}

        {shiftDetails && (
          <CancelShiftModal
            isOpen={cancelShiftModalOpen}
            onClose={() => {
              setCancelShiftModalOpen(false);
            }}
            cancelShift={(reason, details, bulkOperation) => {
              cancelShiftRequest(
                shiftDetails!.id,
                reason,
                details,
                bulkOperation
              )
                .then(() => {
                  setSelectedShiftId(undefined);
                  setCancelShiftModalOpen(false);
                  reloadShifts();
                })
                .catch((error) => {
                  handleUncaughtError(error, t('error_cancel_shift'));
                  Logger.error('Error on cancel shift', error);
                });
            }}
            isRecurrent={
              !!(
                shiftDetails?.recurrentDates &&
                shiftDetails?.recurrentDates?.length > 1
              )
            }
            shiftDetails={shiftDetails}
          />
        )}
        <CancelShiftReasonsModal
          title={t('decrease_capacity_modal_title')}
          isOpen={removeCapacityModalOpen}
          goBack={() => setRemoveCapacityModalOpen(false)}
          cancelShift={(reason, details) => {
            updateCapacityRequest(
              shiftDetails!.id,
              shiftDetails!.capacity - 1,
              reason,
              details
            )
              .then(() => {
                setRemoveCapacityModalOpen(false);
                refetch();
                reloadShifts();
              })
              .catch((error) => {
                handleUncaughtError(error, t('error_decrease_capacity'));
                Logger.error('Error on decrease capacity', error);
              });
          }}
        />

        <RejectProfessionalReasonsModal
          title={t('reject_professional_modal_title')}
          isOpen={isRejectModalOpen}
          goBack={returnFromRejectModal}
          rejectProfessional={(reason, details) =>
            rejectClaim(shiftDetails!.id, rejectingClaimId!, reason, details)
          }
        />
      </div>

      {denarioError ? (
        <ConfirmationModal
          title={denarioError.title}
          subtitle={denarioError.description}
          isOpen={true}
          handleClose={() => {
            setDenarioError(null);
            setRetryingActionWithDenario(false);
            setActionWithoutDenario(false);
          }}
          dismissTitle={denarioError.actions.secondary.title}
          buttonTitle={denarioError.actions.primary.title}
          onPress={() => {
            setRetryingActionWithDenario(true);
            if (currentAction) {
              switch (currentAction.actionType) {
                case 'accept':
                  onAcceptClaim(currentAction.shiftId, currentAction.claimId);
                  break;
                case 'reject':
                  rejectClaim(
                    currentAction.shiftId,
                    currentAction.claimId,
                    currentAction.reason!,
                    currentAction.details!
                  );
                  break;
                case 'cancelAccept':
                  acceptCancellationRequest(
                    currentAction.shiftId,
                    currentAction.claimId
                  );
                  break;
              }
            }
          }}
          onDismiss={() => {
            setActionWithoutDenario(true);
            if (currentAction) {
              switch (currentAction.actionType) {
                case 'accept':
                  onAcceptClaim(
                    currentAction.shiftId,
                    currentAction.claimId,
                    true
                  );
                  break;
                case 'reject':
                  rejectClaim(
                    currentAction.shiftId,
                    currentAction.claimId,
                    currentAction.reason!,
                    currentAction.details!,
                    true
                  );
                  break;
                case 'cancelAccept':
                  acceptCancellationRequest(
                    currentAction.shiftId,
                    currentAction.claimId,
                    true
                  );
                  break;
              }
            }
          }}
          buttonIsLoading={retryingActionWithDenario}
          dismissIsLoading={actionWithoutDenario}
        />
      ) : null}
    </div>
  );
};

export const PendingClaimStatuses = new Map<ClaimStatus, boolean>([
  [ClaimStatus.PENDING_APPROVAL, true],
  [ClaimStatus.PENDING_PRO_ACCEPT, true],
]);

export const MissedClaimStatuses = new Map<ClaimStatus, boolean>([
  [ClaimStatus.REJECTED, true],
  [ClaimStatus.REJECTED_BY_PRO, true],
  [ClaimStatus.INVITATION_EXPIRED, true],
]);
