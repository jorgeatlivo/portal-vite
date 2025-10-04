import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';

import { fetchShiftCancelReasons } from '@/services/shifts-calendar';

import { CustomInput } from '@/components/common/CustomInput';
import { ModalContainer } from '@/components/common/ModalContainer';
import { SingleSelectItem } from '@/components/common/SingleSelectItem';

import { SpecializationDTO } from '@/types/shifts';

interface CancelShiftReasonsModalProps {
  goBack: () => void;
  cancelShift: (reason: string, details: string) => void;
  isOpen: boolean;
  title: string;
}

export const CancelShiftReasonsModal: React.FC<
  CancelShiftReasonsModalProps
> = ({ goBack, cancelShift, isOpen, title }) => {
  const { t } = useTranslation('shift-claim-details');
  const [reasons, setReasons] = useState<SpecializationDTO[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const validSelectedReason =
    selectedReason !== null &&
    (selectedReason !== 'OTHER' || details.length > 0);
  const [loading, setLoading] = useState(true);

  const handleCancelShift = () => {
    if (validSelectedReason) {
      cancelShift(selectedReason!, details);
    }
  };

  const handleGoBack = () => {
    setSelectedReason('');
    goBack();
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchShiftCancelReasons()
        .then((response) => {
          setReasons(response);
          setLoading(false);
        })
        .catch((error) => {
          goBack();
        });
    }
  }, [isOpen]);

  return (
    <ModalContainer isOpen={isOpen} onClose={handleGoBack}>
      <div className="w-[410px] rounded-[16px] bg-white shadow-custom">
        <div className="p-medium">
          <p className="heading-md mb-large">{title}</p>
          <div className="p-y-large flex flex-col">
            {!loading ? (
              reasons.map((reason) => (
                <div className="flex w-full flex-col p-small" key={reason.name}>
                  <SingleSelectItem
                    option={reason.displayText}
                    onClick={() => setSelectedReason(reason.name)}
                    checked={selectedReason === reason.name}
                  />
                  {selectedReason === 'OTHER' && reason.name === 'OTHER' && (
                    <div className="pt-small">
                      <CustomInput
                        placeHolder={t('input_details_placeholder')}
                        selectedValue={details}
                        setValue={setDetails}
                      ></CustomInput>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex w-full flex-col p-small">
                <CircularProgress />
              </div>
            )}
          </div>
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
            <button
              type="button"
              className={`flex flex-1 rounded-[100px] px-small py-large text-center ${
                validSelectedReason
                  ? 'bg-Negative-400 text-Text-Inverse'
                  : 'bg-Background-Secondary text-Text-Subtle'
              }`}
              disabled={!validSelectedReason}
              onClick={() => handleCancelShift()}
            >
              <p className="action-regular w-full">
                {t('cancel_shift_modal_button')}
              </p>
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
