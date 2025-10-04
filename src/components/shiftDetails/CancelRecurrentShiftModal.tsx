import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionButton } from '@/components/common/ActionButton';
import LivoIcon from '@/components/common/LivoIcon';
import { ModalContainer } from '@/components/common/ModalContainer';
import { SingleSelectItem } from '@/components/common/SingleSelectItem';

import {
  buildRecurrencyOptions,
  RecurrencyOptionsEnum,
} from '@/types/publish-shift';
import { Shift } from '@/types/shifts';

import colors from '@/config/color-palette';
import { formatDate } from '@/utils';

interface CancelRecurrentShiftModalProps {
  goBack: () => void;
  cancelShift: (option: string) => void;
  isOpen: boolean;
  selectedOption: RecurrencyOptionsEnum;
  setSelectedOption: (option: RecurrencyOptionsEnum) => void;
  shiftDetails: Shift;
}

export const CancelRecurrentShiftModal: React.FC<
  CancelRecurrentShiftModalProps
> = ({
  goBack,
  cancelShift,
  isOpen,
  selectedOption,
  setSelectedOption,
  shiftDetails,
}) => {
  const { t } = useTranslation('shift-claim-details');
  const [recurrentDateExpanded, setRecurrentDatesExpanded] =
    useState<boolean>(false);

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    if (!isOpen) {
      setRecurrentDatesExpanded(false);
    }
  }, [isOpen]);

  const recurrendDatesComponent = (
    <div>
      <div
        onClick={() => setRecurrentDatesExpanded(!recurrentDateExpanded)}
        className="mb-small flex cursor-pointer flex-row items-center space-x-small"
      >
        <p className="action-regular text-Primary-500">
          {recurrentDateExpanded ? 'Ver menos' : 'Ver más'}
        </p>
        <LivoIcon
          size={24}
          name={recurrentDateExpanded ? 'chevron-up' : 'chevron-down'}
          color={colors['Primary-500']}
        />
      </div>
      {recurrentDateExpanded ? (
        <div className="flex max-h-[400px] w-full flex-col space-y-tiny overflow-y-auto rounded-[8px] px-medium py-small ring-1 ring-Divider-Default">
          <p className="info-caption">
            {`Se eliminarán ${shiftDetails.recurrentDates.length} turnos de ${shiftDetails.specialization.displayText}:`}
          </p>
          <div>
            {shiftDetails.cancellableShiftDates.map((date, index) => (
              <p className="body-regular text-Text-Subtle">
                - {formatDate(date)}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  const recurrencyOptions = useMemo(() => buildRecurrencyOptions(), []);

  return (
    <ModalContainer isOpen={isOpen} onClose={() => handleGoBack()}>
      <div className="w-[410px] rounded-[16px] bg-white shadow-custom">
        <div className="px-xLarge py-medium">
          <p className="heading-md mb-large">
            {t('cancel_shift_recurrent_title')}
          </p>
          <div className="flex flex-col space-y-large">
            {recurrencyOptions.map((option, index) => (
              <div key={index} className="flex w-full flex-col">
                <SingleSelectItem
                  option={option.label}
                  onClick={() => setSelectedOption(option.name)}
                  checked={selectedOption === option.name}
                />
              </div>
            ))}
          </div>
          {recurrendDatesComponent}
          <div className="mt-large flex flex-row items-center">
            <button
              type="button"
              onClick={() => handleGoBack()}
              className="flex flex-1 items-center justify-center px-small py-large  text-center text-Primary-500"
            >
              <p className="action-regular w-full">
                {t('cancel_shift_modal_go_back')}
              </p>
            </button>
            <ActionButton
              onClick={() => cancelShift(selectedOption)}
              isDisabled={false}
              isLoading={false}
              color={colors['Negative-400']}
              style={{
                flex: 1,
              }}
            >
              <p className="action-regular w-full py-small">
                {t('cancel_shift_recurrent_button')}
              </p>
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
