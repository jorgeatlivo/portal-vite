import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { isNil } from 'lodash-es';

import { handleApiError, isDenarioNotSyncedError } from '@/services/api';
import { deleteClaimRequest } from '@/services/claims';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { ConfirmationModal } from '@/components//common/ConfirmationModal';
import { MaterialActionButton } from '@/components//common/MaterialActionButton';
import { ModalContainer } from '@/components//common/ModalContainer';

import { ClaimRequest, DenarioErrorPayload } from '@/types/claims';

import colors from '@/config/color-palette';
import { AppDispatch } from '@/store';
import { CancelInternalProfessionalClaimReasons } from './CancelInternalProfessionalReasons';

interface CancelInternalProfessionalClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  shiftId: number;
  claim: ClaimRequest;
  goBack: () => void;
  onDelete: (reason: string) => void;
}

export const CancelInternalProfessionalClaimModal: React.FC<
  CancelInternalProfessionalClaimModalProps
> = ({ isOpen, onClose, onConfirm, shiftId, claim, goBack, onDelete }) => {
  const { t } = useTranslation(['cancel-approved-claim']);

  const [selectedReason, setSelectedReason] = useState<string>('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [retryingActionWithDenario, setRetryingActionWithDenario] =
    useState(false);
  const [actionWithoutDenario, setActionWithoutDenario] = useState(false);
  const [denarioError, setDenarioError] = useState<DenarioErrorPayload | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();

  const cancelClaimRequest = (skipConstraints?: boolean) => {
    setLoadingRequest(true);
    return deleteClaimRequest(
      shiftId,
      claim.id,
      selectedReason,
      skipConstraints
    )
      .then(() => {
        goBack();
        onDelete(selectedReason);
        setRetryingActionWithDenario(false);
        setActionWithoutDenario(false);
        setDenarioError(null);
      })
      .catch((error: any) => {
        setRetryingActionWithDenario(false);
        setActionWithoutDenario(false);
        if (isDenarioNotSyncedError(error.response.data)) {
          const extraData = error.response.data
            .extraData as DenarioErrorPayload;
          setDenarioError(extraData);
        } else {
          error.response.data.errorMessage
            ? dispatch(
                showToastAction({
                  message: error.response.data.errorMessage,
                  severity: 'error',
                })
              )
            : handleApiError(error);
        }
      })
      .finally(() => setLoadingRequest(false));
  };

  return isNil(denarioError) ? (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <div className="w-[450px] rounded-[16px] bg-white shadow-custom">
        <div className="p-large">
          <h3 className="heading-md mb-medium">{t('modal_title')}</h3>
          <div
            className="body-regular"
            style={{
              alignSelf: 'flex-start',
              fontFamily: 'Roboto',
              fontSize: '13px',
              lineHeight: '20px',
              color: '#7D7D7D',
              marginBottom: '12px',
            }}
          >
            {t('modal_body')}
          </div>
          <div
            className="info caption"
            style={{
              fontFamily: 'Roboto',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: '20px',
              color: colors['Grey-950'],
            }}
          >
            Motivo de la cancelación
          </div>
          <CancelInternalProfessionalClaimReasons
            onSelectReason={setSelectedReason}
            selectedReason={selectedReason}
          />
          <div className="mt-xLarge flex flex-row items-center">
            <MaterialActionButton
              onClick={onClose}
              variant="text"
              className="flex flex-1 items-center justify-center px-small py-large !text-Primary-500"
            >
              <p className="action-regular w-full">
                {t('return_button_label')}
              </p>
            </MaterialActionButton>
            <MaterialActionButton
              isLoading={loadingRequest}
              className="flex flex-1 items-center justify-center px-small py-large"
              tint={colors['Red-500']}
              variant="contained"
              onClick={() => cancelClaimRequest()}
            >
              <p className="action-regular w-full">
                {t('cancel_button_label')}
              </p>
            </MaterialActionButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  ) : (
    <ConfirmationModal
      title={denarioError.title}
      subtitle={denarioError.description}
      isOpen={true}
      handleClose={() => {
        setDenarioError(null);
        setRetryingActionWithDenario(false);
        setActionWithoutDenario(false);
        onClose();
      }}
      dismissTitle={denarioError.actions.secondary.title}
      buttonTitle={denarioError.actions.primary.title}
      onPress={() => {
        setRetryingActionWithDenario(true);
        cancelClaimRequest();
      }}
      onDismiss={() => {
        setActionWithoutDenario(true);
        cancelClaimRequest(true);
      }}
      buttonIsLoading={retryingActionWithDenario}
      dismissIsLoading={actionWithoutDenario}
    />
  );
};
