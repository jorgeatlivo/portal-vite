import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { usePostHog } from 'posthog-js/react';

import { Typography } from '@/components/atoms/Typography';
import LoadingView from '@/components/common/LoadingView';
import { MainPageHeader } from '@/components/common/MainPageHeader';

import { OfferStatus } from '@/types/offers';
import { markdown } from '@/utils/markdown';

import OfferDetail from '@/pages/OfferDetail';
import OfferCreation from '@/pages/OfferDetail/OfferCreationPage/OfferCreation';
import {
  FilterSelection,
  FiltersRow,
} from '@/pages/Offers/components/FilterRow';
import OfferRow from '@/pages/Offers/components/OfferRow';
import OfferRowItem from '@/pages/Offers/components/OfferRowItem';
import {
  OfferProvider,
  useOfferContext,
} from '@/pages/Offers/contexts/offer.context';
import useFetchOfferList from '@/pages/Offers/hooks/useFetchOfferList';
import OfferSlotView from '@/pages/Offers/views/OfferSlots';
import { RouteBreadcrumbs } from '@/routers/config';

const OfferList: React.FC = () => {
  const posthog = usePostHog();
  const { t } = useTranslation('offers');
  const navigate = useNavigate();
  const { selectedFilter, setFilter, setSlots } = useOfferContext();
  const { status = 'all' } = selectedFilter;

  const { isLoading, listResponse } = useFetchOfferList();
  const { slots, contactedReason, rows } = listResponse ?? {};

  useEffect(() => {
    setSlots(slots ?? undefined);
  }, [setSlots, slots]);

  const offers = useMemo(() => {
    return (
      listResponse?.rows.filter((offer) => {
        const _status = status as keyof typeof OFFER_STATUSES;
        if (!_status || _status === 'all') return true;
        return offer.status === OFFER_STATUSES[_status]?.mappingStatus;
      }) ?? []
    );
  }, [listResponse?.rows, status]);

  const onPressCreateOfferButton = () => {
    posthog.capture('new_offer_cta');
    navigate(`/${RouteBreadcrumbs.OffersPage}?action=create-offer`);
  };

  return (
    <div className="relative flex size-full justify-between overflow-hidden">
      <div className="no-scrollbar flex w-full flex-1 justify-center overflow-y-auto pt-xLarge">
        <div className="flex size-full max-w-screen-lg flex-col px-xLarge  md:pb-xLarge">
          <MainPageHeader
            title={t('offer_list_title')}
            counter={(slots?.offers?.length || 0) + (rows?.length || 0)}
            buttonLabel={t('create_offer_button')}
            action={onPressCreateOfferButton}
            icon={'plus'}
          />
          <OfferSlotView
            slots={slots}
            isLoading={isLoading}
            contactedReason={contactedReason}
          />

          <div className="mt-6 w-full flex-col flex-wrap items-center gap-4">
            <Typography variant="heading/small" className="pb-1">
              {t('offer_title_created')}
            </Typography>
            {slots?.maxPublicationsPerMonth && (
              <Typography variant="body/regular" className="pb-4">
                {t('number_slots_in_month', {
                  slotsInMonth: slots?.maxPublicationsPerMonth,
                })}
              </Typography>
            )}
            <FiltersRow
              selections={OFFER_STATUS_FILTER_SELECTIONS}
              appliedFilter={status}
              setFilter={(filter: string) => {
                setFilter({ ...selectedFilter, status: filter });
              }}
            />
          </div>
          <div className="flex w-full flex-col justify-center space-y-small pb-4">
            {/* loading state */}
            {isLoading && <LoadingView />}

            {/* empty view */}
            {!isLoading && offers.length === 0 && (
              <>
                {!selectedFilter.search && <NoOfferEver />}

                {!!selectedFilter.search && (
                  <div className="flex flex-col items-center p-medium text-center">
                    <Typography
                      variant={'heading/medium'}
                      className={'pb-small'}
                    >
                      {t('empty_offer_state_title')}
                    </Typography>
                  </div>
                )}
              </>
            )}

            {/* offers list */}
            {!isLoading && offers.length > 0 && (
              <div className="flex w-full flex-col gap-6 pb-12">
                {offers.map((offer, index) => (
                  <OfferRow
                    key={`offer-list-${status ?? 'all'}-${offer.id}`}
                    index={index}
                  >
                    <OfferRowItem offer={offer} />
                  </OfferRow>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <OfferDetail />
      <OfferCreation />
    </div>
  );
};

const OFFER_STATUSES = {
  all: {
    index: 0,
    label: 'filter_all',
    mappingStatus: 'ALL',
  },
  draft: {
    index: 1,
    label: 'filter_draft',
    mappingStatus: OfferStatus.DRAFT,
  },
  closed: {
    index: 2,
    label: 'filter_closed',
    mappingStatus: OfferStatus.CLOSED,
  },
};

const OFFER_STATUS_FILTER_SELECTIONS: FilterSelection[] = Object.entries(
  OFFER_STATUSES
)
  .map(([id, { label, mappingStatus, index }]) => ({
    id,
    index,
    label,
    mappingStatus,
  }))
  .sort((a, b) => a.index - b.index);

const OfferListContainer = () => {
  return (
    <OfferProvider>
      <OfferList />
    </OfferProvider>
  );
};

const NoOfferEver = () => {
  const { t } = useTranslation('offers');
  return (
    <div className="rounded-[12px] border bg-white p-xLarge">
      <Typography variant="heading/small" className="pb-1 font-semibold">
        {t('list_no_offer_ever_title')}
      </Typography>
      <Typography variant="body/regular">
        {markdown(t('list_no_offer_ever_content'))}
      </Typography>
    </div>
  );
};

export default OfferListContainer;
