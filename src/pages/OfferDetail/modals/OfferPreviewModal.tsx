import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { usePostHog } from 'posthog-js/react';

import { PublishOfferResponse } from '@/services/facility-offer';

import DialogConfirmButtons from '@/components/common/buttons/DialogConfirmButtons';

import { useModal } from '@/hooks/use-modal';
import { OfferDetail, OfferSubscription } from '@/types/offers';
import { checkBannerDisplay } from '@/utils/bannerUtils';

import OfferInfoCard from '@/pages/OfferDetail/components/OfferInfoCard';
import { usePublishOffer } from '@/pages/OfferDetail/hooks/useMutationOffer';

export const OFFER_PREVIEW_MODAL_CLASSES =
  '!w-full !max-w-2xl !overflow-auto rounded-xl shadow-lg !max-h-96vh';

interface OfferPreviewModalProps {
  offer: OfferDetail;
  cancelButtonText?: string;
  subscription?: OfferSubscription;
  onPublishSuccess?: (response?: PublishOfferResponse) => void;
  onPublishFailed?: (error: any) => void;
  onCancelPublish?: () => void;
}

const OfferPreviewModal: FC<OfferPreviewModalProps> = ({
  offer,
  onPublishSuccess,
  onPublishFailed,
  onCancelPublish,
  cancelButtonText,
  subscription,
}) => {
  const posthog = usePostHog();
  const { t } = useTranslation('offers');
  const { closeModal } = useModal();

  const { publishOffer, isPending: isPendingPublish } = usePublishOffer({
    onSuccess: (params) => {
      // When an offer is successfully published, check if banner display should change
      checkBannerDisplay();
      closeModal();
      onPublishSuccess?.(params);
    },
    onError: (error) => {
      closeModal();
      onPublishFailed?.(error);
    },
  });

  const cancelPublish = () => {
    posthog.capture('keep_editing_cta');
    closeModal();
    onCancelPublish?.();
  };

  return (
    <div className="flex w-full flex-col gap-6 overflow-auto p-6">
      <Typography variant="h6" className="font-semibold text-lg">
        {t('offer_preview_modal_title', {
          totalSlots: subscription?.totalSlots ?? '--',
        })}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        {t('offer_preview_modal_subtitle')}
      </Typography>

      {/* Offer Details */}
      <Box
        className={
          'modern-scrollbar max-h-[60vh] overflow-y-scroll rounded-lg border p-4'
        }
      >
        <OfferInfoCard offer={offer} isDetailView={false} />
      </Box>

      <div className="flex items-center justify-between rounded-lg bg-Primary-100 px-4 py-3">
        <Typography variant="body1" className="leading-6 text-Text-Default">
          {t('offer_preview_modal_note', {
            totalSlots: subscription?.totalSlots ?? '--',
            maxPublicationsPerMonth:
              subscription?.maxPublicationsPerMonth ?? '--',
          })}
        </Typography>
      </div>

      {/* Action Buttons */}
      <Box className="flex justify-end gap-3">
        <DialogConfirmButtons
          justify={'center'}
          buttons={[
            {
              label: cancelButtonText || t('offer_preview_modal_cancel_button'),
              onClick: cancelPublish,
              variant: 'outlined',
              className: 'w-52 !mx-4 border-2 rounded-full',
            },
            {
              isLoading: isPendingPublish,
              label: t('offer_preview_modal_accept_button'),
              onClick: () => {
                publishOffer(offer.id);
              },
              variant: 'contained',
              className: 'w-52 !mx-4 border-2 rounded-full',
            },
          ]}
        />
      </Box>
    </div>
  );
};

export default OfferPreviewModal;
