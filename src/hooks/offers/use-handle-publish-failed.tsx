import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import useDialog from '@/hooks/use-dialog';
import { OfferSubscription, SubscriptionStatus } from '@/types/offers';
import { wait } from '@/utils/frame';

import { useContactLivo } from '@/pages/OfferDetail/hooks/usePostContactLivo';
import { RouteBreadcrumbs } from '@/routers/config';

export default function useHandlePublishFailed() {
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const { t } = useTranslation('offers');
  const { contactLivo } = useContactLivo();

  const onPublishFailed = useCallback(
    (slot?: OfferSubscription) => {
      if (!slot) {
        return;
      }

      let dialogTitle = '';
      let dialogContent = '';
      let confirmLabel = t('livo_contact_button');

      if (slot?.status === SubscriptionStatus.NO_SUBSCRIPTION) {
        dialogTitle = t('no_subscriptions_title');
        dialogContent = t('no_subscriptions_content');
      }

      if (slot?.status === SubscriptionStatus.NO_SLOTS_LEFT) {
        dialogTitle = t('no_slots_left_title');
        dialogContent = t('no_slots_left_content', {
          slot: slot?.totalSlots?.toString(),
        });
      }

      if (slot?.status === SubscriptionStatus.NO_PUBLICATIONS_LEFT) {
        dialogTitle = t('no_publications_left_title');
        dialogContent = t('no_publications_left_content', {
          publication: slot?.maxPublicationsPerMonth?.toString(),
        });
      }

      openDialog({
        title: dialogTitle,
        content: dialogContent,
        confirmLabel,
        onConfirm: async () => {
          contactLivo({
            reason: slot?.status,
            source: 'OFFER_PUBLISHING',
          });
          await wait(360);
          openDialog({
            title: t('livo_contact_title'),
            content: t('livo_contact_content'),
            dialogType: 'info',
            singleOption: true,
            confirmLabel: t('btn_contact_confirm'),
            onConfirm: () => {
              navigate(`/${RouteBreadcrumbs.OffersPage}`);
            },
          });
        },
      });
    },
    [contactLivo, navigate, openDialog, t]
  );

  return onPublishFailed;
}
