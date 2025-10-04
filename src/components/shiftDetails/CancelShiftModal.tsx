import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RecurrencyOptionsEnum } from '@/types/publish-shift';
import { Shift } from '@/types/shifts';

import { CancelRecurrentShiftModal } from './CancelRecurrentShiftModal';
import { CancelShiftReasonsModal } from './CancelShiftReasonsModal';

interface CancelShiftModalProps {
  onClose: () => void;
  isOpen: boolean;
  isRecurrent: boolean;
  cancelShift: (
    reason: string,
    details: string,
    bulkOperation?: RecurrencyOptionsEnum
  ) => void;
  shiftDetails: Shift;
}

export const CancelShiftModal: React.FC<CancelShiftModalProps> = ({
  onClose,
  isOpen,
  isRecurrent,
  cancelShift,
  shiftDetails,
}) => {
  // select the the start time according to shift time in day
  const { t } = useTranslation('shift-claim-details');
  const [recurrentOption, setRecurrentOption] = useState<RecurrencyOptionsEnum>(
    RecurrencyOptionsEnum.THIS_SHIFT
  );
  const [cancelRecurrentShiftModalOpen, setCancelRecurrentShiftModalOpen] =
    useState(false);
  const [cancelShiftReasonModalOpen, setCancelShiftReasonModalOpen] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isRecurrent) {
        setCancelRecurrentShiftModalOpen(true);
      } else {
        setCancelShiftReasonModalOpen(true);
      }
    } else {
      setCancelRecurrentShiftModalOpen(false);
      setCancelShiftReasonModalOpen(false);
    }
  }, [isOpen]);

  return (
    <div>
      <CancelShiftReasonsModal
        title={
          recurrentOption === RecurrencyOptionsEnum.ALL_SHIFTS
            ? t('cancel_shift_modal_title_multiple')
            : t('cancel_shift_modal_title')
        }
        isOpen={cancelShiftReasonModalOpen}
        goBack={() => {
          setCancelShiftReasonModalOpen(false);
          onClose();
        }}
        cancelShift={(reason, details) => {
          const bulkOperation =
            recurrentOption === RecurrencyOptionsEnum.THIS_SHIFT
              ? undefined
              : recurrentOption;
          cancelShift(reason, details, bulkOperation);
        }}
      />
      <CancelRecurrentShiftModal
        isOpen={cancelRecurrentShiftModalOpen}
        cancelShift={() => {
          setCancelRecurrentShiftModalOpen(false);
          setCancelShiftReasonModalOpen(true);
        }}
        selectedOption={recurrentOption}
        setSelectedOption={setRecurrentOption}
        goBack={() => {
          setCancelRecurrentShiftModalOpen(false);
          onClose();
        }}
        shiftDetails={shiftDetails}
      />
    </div>
  );
};
