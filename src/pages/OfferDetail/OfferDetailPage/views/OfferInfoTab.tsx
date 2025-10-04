import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { showToastAction } from '@/store/actions/appConfigurationActions';
import { OFFER_LIST_QUERY_KEY } from '@/queries/offer-list';

import LoadingView from '@/components/common/LoadingView';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import useHandlePublishFailed from '@/hooks/offers/use-handle-publish-failed';
import { useInvalidateQuery } from '@/hooks/use-invalidate-query';
import { useModal } from '@/hooks/use-modal';
import {
  OfferStatus,
  OfferSubscription,
  SubscriptionStatus,
} from '@/types/offers';
import { checkBannerDisplay } from '@/utils/bannerUtils';

import colors from '@/config/color-palette';
import OfferInfoCard from '@/pages/OfferDetail/components/OfferInfoCard';
import {
  OfferActionsProvider,
  useOfferActions,
} from '@/pages/OfferDetail/contexts/OfferActionsContext';
import { useOfferDetail } from '@/pages/OfferDetail/contexts/OfferDetailContext';
import OfferPreviewModal, {
  OFFER_PREVIEW_MODAL_CLASSES,
} from '@/pages/OfferDetail/modals/OfferPreviewModal';
import OfferEditForm from '@/pages/OfferDetail/OfferEditPage/OfferEditForm';
import { useOfferContext } from '@/pages/Offers/contexts/offer.context';
import { RouteBreadcrumbs } from '@/routers/config';

interface OfferInfoCardProps {}

const OfferInfoTab: React.FC<OfferInfoCardProps> = () => {
  const { t } = useTranslation('offers');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const onPublishFailed = useHandlePublishFailed();
  const { offer, isLoading, error } = useOfferDetail();
  const invalidateQuery = useInvalidateQuery();
  const { isEditing } = useOfferActions();
  const { slots } = useOfferContext();

  const onPublishOffer = async () => {
    if (!offer?.id) {
      return;
    }

    if (!slots || slots?.status === SubscriptionStatus.NO_SUBSCRIPTION) {
      return onPublishFailed({
        status: SubscriptionStatus.NO_SUBSCRIPTION,
      } as OfferSubscription);
    }

    if (slots.status === SubscriptionStatus.SLOT_AVAILABLE) {
      /**
       * if action is publish
       * we need to show a dialog with the status of the subscription
       */
      const content = (
        <OfferPreviewModal
          subscription={slots}
          offer={offer}
          cancelButtonText={t('offer_preview_modal_cancel_no_edit_button')}
          onPublishSuccess={(response) => {
            checkBannerDisplay();
            /**
             * invalid query because offer published
             */
            dispatch(
              showToastAction({
                message: t('toast_offer_publish_succeeded'),
                severity: 'success',
              })
            );
            invalidateQuery(OFFER_LIST_QUERY_KEY);
            response?.offerId && navigate(`/${RouteBreadcrumbs.OffersPage}`);
          }}
          onPublishFailed={(error) => {
            const { extraData } = error ?? {};
            if (extraData) {
              onPublishFailed(extraData as OfferSubscription);
            }
          }}
        />
      );

      return openModal(content, {
        className: OFFER_PREVIEW_MODAL_CLASSES,
      });
    }

    onPublishFailed(slots);
  };

  if (isLoading) {
    return (
      <div className="mx-auto my-6 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <LoadingView />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto my-6 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <h1 className="heading-md">{error.message}</h1>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="mx-auto my-6 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <h1 className="heading-md">{t('empty_offer_state_title')}</h1>
      </div>
    );
  }

  if (isEditing) {
    return <OfferEditForm />;
  }

  return (
    <div className="relative flex h-full max-h-screen flex-1 justify-center gap-6 overflow-hidden">
      <OfferInfoCard offer={offer} isDetailView />
      {offer.status === OfferStatus.DRAFT && (
        <div className="flex w-fit flex-col gap-4 pt-6 md:min-w-48">
          <MaterialActionButton
            variant="contained"
            className="!md:min-w-48"
            tint={colors['Primary-500']}
            onClick={onPublishOffer}
          >
            {t('publish_offer_action')}
          </MaterialActionButton>
        </div>
      )}
    </div>
  );
};

const OfferInfoTabContainer: FC = () => {
  return (
    <OfferActionsProvider>
      <OfferInfoTab />
    </OfferActionsProvider>
  );
};

export default OfferInfoTabContainer;
