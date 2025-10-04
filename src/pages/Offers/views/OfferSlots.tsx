import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { IconInfoCircle } from '@tabler/icons-react';
import clsx from 'clsx';

import { translate } from '@/services/i18next/translate';

import useDialog from '@/hooks/use-dialog';
import { OfferSlots, SubscriptionStatus } from '@/types/offers';
import { markdown } from '@/utils/markdown';

import colors from '@/config/color-palette';
import { useContactLivo } from '@/pages/OfferDetail/hooks/usePostContactLivo';
import OfferRow from '@/pages/Offers/components/OfferRow';
import OfferRowItem from '@/pages/Offers/components/OfferRowItem';

function OfferSlotView({
  slots,
  isLoading,
  contactedReason,
}: {
  slots?: OfferSlots | null;
  isLoading: boolean;
  contactedReason?: SubscriptionStatus;
}) {
  const { t } = useTranslation('offers');
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const { state, pathname } = useLocation();
  const { contactLivo } = useContactLivo();
  const isOpeningContactDialogRef = useRef(false);

  const slotList = useMemo(() => {
    if (!slots || !slots.totalSlots) return [];

    return new Array(slots.totalSlots).fill(null).map((_, index) => {
      const offer = slots.offers[index];
      return {
        id: offer?.id,
        offer,
      };
    });
  }, [slots]);

  const haveSlots = useMemo(() => !!slots && slots.totalSlots > 0, [slots]);

  const toolTips = useMemo(() => {
    if (!slots || slots?.status === SubscriptionStatus.NO_SUBSCRIPTION) {
      return t('tooltip_slot_no_subscription');
    }

    const {
      totalSlots = 0,
      remainingPublicationsPerMonth,
      remainingSlots,
      maxPublicationsPerMonth,
    } = slots ?? {};

    let status = t('tooltip_slot_status', {
      remainingSlots,
      totalSlots,
      remainingPublicationsPerMonth,
      maxPublicationsPerMonth,
    });
    let message = status;

    if (
      (slots?.status === SubscriptionStatus.NO_SLOTS_LEFT ||
        slots?.status === SubscriptionStatus.NO_PUBLICATIONS_LEFT) &&
      remainingPublicationsPerMonth === 0 &&
      remainingSlots === 0
    ) {
      message = [
        status,
        t('tooltip_need_slots_publications_cta'),
        t('tooltip_contact_cta'),
      ].join('\n\n');
    } else if (slots?.status === SubscriptionStatus.NO_SLOTS_LEFT) {
      message = [
        status,
        t('tooltip_need_slots'),
        t('tooltip_contact_cta'),
      ].join('\n\n');
    } else if (slots?.status === SubscriptionStatus.NO_PUBLICATIONS_LEFT) {
      message = [
        status,
        t('tooltip_need_publications'),
        t('tooltip_contact_cta'),
      ].join('\n\n');
    }

    return (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {message}
      </Typography>
    );
  }, [slots, t]);

  const handleDialogConfirm = useCallback(() => {
    navigate(pathname, { state: undefined });
    isOpeningContactDialogRef.current = false;
  }, [navigate, pathname]);

  useEffect(() => {
    if (state !== 'contact-us' || isOpeningContactDialogRef.current) return;

    isOpeningContactDialogRef.current = true;

    contactLivo({
      reason: SubscriptionStatus.NO_SUBSCRIPTION,
      source: 'OFFER_LISTING',
    });

    openDialog({
      title: t('livo_contact_title'),
      content: t('livo_contact_content'),
      dialogType: 'info',
      singleOption: true,
      confirmLabel: t('btn_contact_confirm'),
      onConfirm: handleDialogConfirm,
    });
  }, [state, openDialog, contactLivo, handleDialogConfirm, t]);

  return isLoading ? (
    <div className="flex h-[250px] items-center justify-center overflow-hidden rounded-[16px] border-2 border-dashed border-Grey-600">
      <CircularProgress size={40} />
    </div>
  ) : (
    <Box>
      <Typography variant="h6" className="mb-1 leading-6">
        {translate('offers:slots_list_title')}
        <Tooltip
          sx={{ whiteSpace: 'pre-line' }}
          title={toolTips}
          placement="bottom"
          disableHoverListener={!toolTips}
        >
          <IconInfoCircle
            size={24}
            color={colors['Text-Default']}
            className="mb-1 ml-1 inline-block"
          />
        </Tooltip>
      </Typography>
      {!haveSlots && (
        <div className="mb-4 mt-medium rounded-[12px] border bg-white p-xLarge">
          <Typography variant="h6" className="mb-1 font-semibold leading-6">
            {translate('offers:not_slots_available_title')}
          </Typography>
          <Typography variant="body1" className="leading-6">
            {contactedReason
              ? translate(
                  'offers:not_slots_available_content_with_already_contacted'
                )
              : markdown(translate('offers:not_slots_available_content'))}
          </Typography>
        </div>
      )}
      {haveSlots && (
        <Typography variant="body1" className="pb-4">
          {t('number_slots_available', { slots: slots?.totalSlots })}{' '}
          {contactedReason && t('contact_get_more_slots')}
        </Typography>
      )}

      {haveSlots && (
        <Box className="space-y-4">
          <div className="overflow-hidden rounded-[16px] border-2 border-dashed border-Grey-600">
            {slotList.map((item, index) => (
              <SlotItem
                key={`offer-slot-${item?.id || `empty-${index}`}`}
                item={item}
                index={index}
                isLast={index === slotList.length - 1}
              />
            ))}
          </div>
        </Box>
      )}
    </Box>
  );
}

const EmptySlot = memo(() => (
  <Typography variant="body1" className="!my-0.5 text-Text-Subtle">
    {translate('offers:empty_slot')}
  </Typography>
));

const SlotItem = memo(
  ({ item, index, isLast }: { item: any; index: number; isLast: boolean }) => (
    <div
      className={clsx('p-4', {
        'border-b-2 border-dashed border-Grey-600': !isLast,
      })}
    >
      <OfferRow index={index}>
        {!item.id ? <EmptySlot /> : <OfferRowItem offer={item.offer} />}
      </OfferRow>
    </div>
  )
);

export default memo(OfferSlotView);
