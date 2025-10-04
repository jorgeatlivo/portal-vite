import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isDenarioNotSyncedError } from '@/services/api';
import { shiftClaimAccept } from '@/services/claims';

import { ActionButton } from '@/components/common/ActionButton';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import LivoIcon from '@/components/common/LivoIcon';
import { MultipleLineInput } from '@/components/common/MultipleLineInput';
import { DropDownWithInput } from '@/components/publishShift/DropDownWithInput';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import { ClaimRequest, DenarioErrorPayload } from '@/types/claims';

import colors from '@/config/color-palette';

interface AcceptProfessionalWithClaimReasonProps {
  claim: ClaimRequest;
  goBack: () => void;
  onAccept: () => void;
  shiftId: number;
  handleClaimError: (error: any) => void;
}

export const AcceptProfessionalWithClaimReason: React.FC<
  AcceptProfessionalWithClaimReasonProps
> = ({ claim, goBack, onAccept, shiftId, handleClaimError }) => {
  const { t } = useTranslation('shift-claim-details');
  const [newComment, setNewComment] = useState('');
  const [newSlotReason, setNewSlotReason] = useState('');
  const [loading, setLoading] = useState(false);

  const [retryingActionWithDenario, setRetryingActionWithDenario] =
    useState(false);
  const [actionWithoutDenario, setActionWithoutDenario] = useState(false);
  const [denarioError, setDenarioError] = useState<DenarioErrorPayload | null>(
    null
  );

  const acceptRequestCall = (skipConstraints?: boolean) => {
    setLoading(true);
    shiftClaimAccept(
      shiftId,
      claim.id,
      newSlotReason,
      newComment,
      skipConstraints
    )
      .then(() => {
        onAccept();
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
        } else {
          handleClaimError(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-small flex w-full flex-row items-center space-x-tiny">
        <button type="button" onClick={goBack}>
          <LivoIcon size={24} name="close" color={colors['Grey-700']} />
        </button>
        <p className="heading-md">{t('slot_reason_label')}</p>
      </div>
      <div className="flex w-full flex-col space-y-large self-start p-medium">
        <div className="flex w-full flex-col items-center justify-center space-y-small">
          <ProfilePicture
            profilePictureUrl={claim.professionalProfile.profilePictureUrl}
            size={64}
            modality={claim.modality}
          />
          <p className="heading-md">
            {claim.professionalProfile.firstName}{' '}
            {claim.professionalProfile.lastName}
          </p>
        </div>

        <DropDownWithInput
          options={claim.slotReasonOptions?.map((reason) => {
            return {
              id: reason.value,
              name: reason.displayText,
            };
          })}
          selectedOptionId={newSlotReason}
          setOptionId={(value) => setNewSlotReason(value)}
          placeHolder={t('slot_reason_label')}
        />
        <div>
          {claim.slotReasonCommentDisplayed && (
            <MultipleLineInput
              setInputValue={setNewComment}
              inputValue={newComment}
              placeHolder={t('slot_reason_comment')}
            />
          )}
        </div>

        <ActionButton
          onClick={() => {
            acceptRequestCall();
          }}
          isDisabled={newSlotReason.length === 0}
          isLoading={loading}
          style={{
            flex: 1,
          }}
        >
          <p className="action-regular w-full py-tiny">
            {t('slot_reason_accept')}
          </p>
        </ActionButton>
      </div>

      {denarioError && (
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
            acceptRequestCall();
          }}
          onDismiss={() => {
            setActionWithoutDenario(true);
            acceptRequestCall(true);
          }}
          buttonIsLoading={retryingActionWithDenario}
          dismissIsLoading={actionWithoutDenario}
        />
      )}
    </div>
  );
};
