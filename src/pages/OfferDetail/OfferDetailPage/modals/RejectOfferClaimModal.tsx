import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';

import { fetchOfferClaimRejectReasons } from '@/services/offers';

import { CustomInput } from '@/components/common/CustomInput';
import { SingleSelectItem } from '@/components/common/SingleSelectItem';

import { OfferClaimRejectReason } from '@/types/offers';

interface RejectOfferClaimModalProps {
  professionalName: string;
  rejectOfferClaim: (reason: string, details: string) => void;
  onClose: () => void;
}

export const RejectOfferClaimModal: React.FC<RejectOfferClaimModalProps> = ({
  professionalName,
  rejectOfferClaim,
  onClose,
}) => {
  const { t } = useTranslation('offers');
  const [reasons, setReasons] = useState<OfferClaimRejectReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  const validSelectedReason =
    selectedReason !== null &&
    (selectedReason !== 'OTHER' || details.length > 0);

  useEffect(() => {
    setLoading(true);
    fetchOfferClaimRejectReasons().then((response) => {
      setReasons(response);
      setLoading(false);
    });
  }, []);

  const handleRejectOfferClaim = () => {
    if (validSelectedReason) {
      rejectOfferClaim(selectedReason!, details);
    }
  };

  return (
    <section>
      <div className="px-6 pb-3 pt-6">
        <h3 className="heading-md mb-4">
          {t('reject_offer_claim_modal_title', {
            professionalName: professionalName,
          })}
        </h3>
        <p className="body-md mb-4">
          {t('reject_offer_claim_modal_description')}
        </p>
        {!loading ? (
          reasons.map((reason) => (
            <div key={reason.name} className="flex w-full flex-col py-small">
              <SingleSelectItem
                option={reason.displayText}
                onClick={() => setSelectedReason(reason.name)}
                checked={selectedReason === reason.name}
              />
              {selectedReason === 'OTHER' && reason.name === 'OTHER' && (
                <div className="pt-small">
                  <CustomInput
                    placeHolder={t('input_placeholder_details')}
                    selectedValue={details}
                    setValue={setDetails}
                  ></CustomInput>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex w-full flex-col items-center justify-center p-small">
            <CircularProgress />
          </div>
        )}
      </div>

      <div className="px-3 pb-4 pt-6">
        <div className="flex flex-row items-center">
          {' '}
          {/* Changed margin-top to add space */}
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center px-small py-large text-center text-Primary-500"
          >
            <p className="action-regular w-full">
              {t('reject_offer_claim_modal_cancel_button')}
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
            onClick={() => {
              handleRejectOfferClaim();
            }}
          >
            <p className="action-regular w-full">
              {t('reject_offer_claim_modal_accept_button')}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
