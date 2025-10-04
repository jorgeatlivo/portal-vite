import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';

import { SubscriptionStatus } from '@/types/offers';

import { useContactLivo } from '@/pages/OfferDetail/hooks/usePostContactLivo';

interface ZombieOfferModalProps {
  onClose: () => void;
}

export const ZombieOfferModal: React.FC<ZombieOfferModalProps> = ({
  onClose,
}) => {
  const { contactLivo } = useContactLivo();
  const { t } = useTranslation('offers');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleContactLivo = () => {
    contactLivo({
      reason: SubscriptionStatus.ZOMBIE_OFFER_REVEAL,
      source: 'ZOMBIE_OFFER',
    });
    setShowConfirmation(true);
  };

  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showConfirmation, onClose]);

  const title = showConfirmation
    ? t('zombie_offer_modal_success_title')
    : t('zombie_offer_modal_title');

  const subtitle = showConfirmation
    ? t('zombie_offer_modal_success_content') + '\n' + t('livo_contact_content')
    : t('zombie_offer_modal_content');

  return (
    <>
      <div className="flex flex-col items-center gap-3 px-6 pb-3 pt-6">
        <Typography
          variant="h5"
          className="!font-semibold text-xl text-Text-Default"
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          className={`text-Text-Default ${showConfirmation ? 'pb-6 text-center' : ''}`}
        >
          {subtitle}
        </Typography>
      </div>
      {!showConfirmation ? (
        <div className="flex justify-center px-3 py-6">
          <div className="flex w-8/12 flex-row items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 items-center justify-center rounded-[100px] border-2 border-Primary-500 px-small py-[10px] text-center text-Primary-500"
            >
              <Typography className="action-regular w-full">
                {t('zombie_offer_modal_cancel_button')}
              </Typography>
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center rounded-[100px] bg-Primary-500 px-small py-medium text-center text-Text-Inverse"
              onClick={handleContactLivo}
            >
              <Typography className="action-regular w-full">
                {t('zombie_offer_modal_button')}
              </Typography>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center pb-6">
          <button
            type="button"
            onClick={onClose}
            className="w-4/12 items-center justify-center rounded-[100px] border-2 bg-Primary-500 px-small py-medium text-center text-white"
          >
            <Typography className="action-regular">
              {t('btn_contact_confirm')}
            </Typography>
          </button>
        </div>
      )}
    </>
  );
};
