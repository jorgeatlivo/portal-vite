import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';

import { fetchShiftClaimRejectReasons } from '@/services/claims';

import { CustomInput } from '@/components/common/CustomInput';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';
import { SingleSelectItem } from '@/components/common/SingleSelectItem';

import { SpecializationDTO } from '@/types/shifts';

import colors from '@/config/color-palette';

interface RejectProfessionalReasonsModalProps {
  goBack: () => void;
  rejectProfessional: (reason: string, details: string) => Promise<void>;
  isOpen: boolean;
  title: string;
}

export const RejectProfessionalReasonsModal: React.FC<
  RejectProfessionalReasonsModalProps
> = ({ goBack, rejectProfessional, isOpen, title }) => {
  const { t } = useTranslation('shift-claim-details');
  const isOpenClass = isOpen ? 'block' : 'hidden';
  const [reasons, setReasons] = useState<SpecializationDTO[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
  const [details, setDetails] = useState('');
  const validSelectedReason =
    selectedReason !== null &&
    (selectedReason !== 'OTHER' || details.length > 0);
  const [loading, setLoading] = useState(true);

  const handleRejectProfessional = useCallback(async () => {
    setLoadingRequest(true);
    if (validSelectedReason) {
      await rejectProfessional(selectedReason!, details);
    }
    setLoadingRequest(false);
  }, [details, rejectProfessional, selectedReason, validSelectedReason]);

  const handleGoBack = useCallback(() => {
    setSelectedReason(null);
    goBack();
  }, [goBack]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchShiftClaimRejectReasons()
        .then((response) => {
          setReasons(response);
          setLoading(false);
        })
        .catch(handleGoBack);
    }
  }, [handleGoBack, isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center overflow-y-auto ${isOpenClass} items-center`}
    >
      <div className="fixed inset-0 -z-50 bg-black opacity-50"></div>

      <div className="w-[410px] rounded-[16px] bg-white shadow-custom">
        <div className="p-medium">
          <p className="heading-md mb-large">{title}</p>
          <div className="p-y-large flex flex-col">
            {!loading ? (
              reasons.map((reason) => (
                <div className="flex w-full flex-col p-small">
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
              <div className="flex w-full flex-col items-center p-small">
                <CircularProgress />
              </div>
            )}
          </div>
          <div className="mt-large flex flex-row items-center">
            <MaterialActionButton
              onClick={handleGoBack}
              variant="text"
              className="flex flex-1 items-center justify-center px-small py-large !text-Primary-500"
            >
              <p className="action-regular w-full">
                {t('cancel_shift_modal_go_back')}
              </p>
            </MaterialActionButton>
            <MaterialActionButton
              isLoading={loadingRequest}
              className="flex flex-1 items-center justify-center px-small py-large"
              tint={colors['Red-500']}
              variant="contained"
              isDisabled={!validSelectedReason}
              onClick={handleRejectProfessional}
            >
              <p className="action-regular w-full">
                {t('reject_professional_modal_button')}
              </p>
            </MaterialActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};
