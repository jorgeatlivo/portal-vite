import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateClaimSlotReason } from '@/services/claims';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { Typography } from '@/components/atoms/Typography';
import { ActionButton } from '@/components/common/ActionButton';
import { MultipleLineInput } from '@/components/common/MultipleLineInput';
import { DropDownWithInput } from '@/components/publishShift/DropDownWithInput';

import colors from '@/config/color-palette';
import { SlotReason, SlotReasonOption } from '../../../types/claims';
import LivoIcon from '../../common/LivoIcon';

interface SlotReasonDetailsProps {
  slotReasonOptions: SlotReasonOption[];
  slotReason: SlotReason | null;
  claimId: number;
  shiftId: number;
  slotReasonCommentDisplayed: boolean;
  onUpdateSlotReason: (slotReason: SlotReason) => void;
}
export const SlotReasonDetails: React.FC<SlotReasonDetailsProps> = ({
  slotReason,
  slotReasonOptions,
  claimId,
  shiftId,
  slotReasonCommentDisplayed,
  onUpdateSlotReason,
}) => {
  const { t } = useTranslation('shift-claim-details');
  const [newComment, setNewComment] = useState(slotReason?.comment || '');
  const [newSlotReason, setNewSlotReason] = useState(slotReason?.value || '');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const isEditting =
    newComment !== slotReason?.comment || newSlotReason !== slotReason?.value;

  const onCancelEdit = () => {
    setNewComment(slotReason?.comment || '');
    setNewSlotReason(slotReason?.value || '');
  };
  const updateClaimSlotReasonCall = () => {
    setLoading(true);
    updateClaimSlotReason(shiftId, claimId, newSlotReason, newComment)
      .then(() => {
        setLoading(false);
        onUpdateSlotReason({
          value: newSlotReason,
          comment: newComment,
          displayText:
            slotReasonOptions.find((reason) => reason.value === newSlotReason)
              ?.displayText || '',
        });
        dispatch(
          showToastAction({
            message: t('slot_reason_update_success'),
            severity: 'success',
          })
        );
      })
      .catch((_: Error) => {
        setLoading(false);
        dispatch(
          showToastAction({
            message: t('slot_reason_update_error'),
            severity: 'error',
          })
        );
      });
  };

  return (
    <div className="flex flex-col space-y-medium p-medium">
      <div className="flex flex-row items-center space-x-small">
        <LivoIcon name="replace" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">{t('slot_reason_label')}</Typography>
      </div>
      <DropDownWithInput
        options={slotReasonOptions.map((reason) => {
          return {
            id: reason.value,
            name: reason.displayText,
          };
        })}
        selectedOptionId={newSlotReason}
        setOptionId={(value) => setNewSlotReason(value)}
        placeHolder={t('input_replacement_reason_placeholder')}
        callToActionIcon={!isEditting ? 'pencil' : undefined}
      />
      <div>
        <MultipleLineInput
          setInputValue={setNewComment}
          inputValue={newComment}
          placeHolder={t('input_replacement_comment_placeholder')}
          callToActionIcon={!isEditting ? 'pencil' : undefined}
        />
      </div>
      {isEditting ? (
        <div className="flex flex-row items-center space-x-large">
          <button
            type="button"
            onClick={() => {
              onCancelEdit();
            }}
            className="flex flex-1 items-center justify-center px-xLarge py-medium  text-center text-Negative-500"
          >
            <Typography variant="action/regular">
              {t('cancel_slot_reason_button')}
            </Typography>
          </button>
          <ActionButton
            onClick={() => {
              updateClaimSlotReasonCall();
            }}
            isDisabled={newSlotReason.length === 0}
            isLoading={loading}
            style={{ flex: 1 }}
          >
            <Typography
              variant="action/regular"
              color={colors['Neutral-000']}
              className="py-tiny"
            >
              {t('update_slot_reason_button')}
            </Typography>
          </ActionButton>
        </div>
      ) : null}
    </div>
  );
};
