import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import { RootState } from '@/store/types';
import { OFFER_LIST_QUERY_KEY } from '@/queries/offer-list';

import { NavigationTabs, Tab } from '@/components/common/NavigationTabs';
import { useUpdateFacility } from '@/components/layout/hooks/useUpdateFacility';

import { useInvalidateQuery } from '@/hooks/use-invalidate-query';
import { useSearchParam } from '@/hooks/use-search-params';
import { OfferStatus } from '@/types/offers';
import { enumOf } from '@/utils/utils';

import {
  OfferDetailProvider,
  useOfferDetail,
} from '@/pages/OfferDetail/contexts/OfferDetailContext';
import { OfferClaimsList } from '@/pages/OfferDetail/OfferDetailPage/views/OfferClaimsList';
import { ReturnButtonHeader } from '@/pages/shared/ShiftForm/components/ReturnButtonHeader';
import { RouteBreadcrumbs } from '@/routers/config';
import { useOfferLabels } from '../hooks/useOfferTitle';
import OfferInfoTab from './views/OfferInfoTab';

export enum TabValues {
  CANDIDATES = 'CANDIDATE',
  DETAILS = 'DETAILS',
}

interface OfferDetailViewProps {
  defaultTab?: TabValues;
}

const OfferDetailView = ({ defaultTab }: OfferDetailViewProps) => {
  const { t } = useTranslation('offers');
  const { mutate } = useUpdateFacility();
  const navigate = useNavigate();

  const accountInfo = useSelector(
    (state: RootState) => state.account.accountInfo
  );

  const [isVisible, setIsVisible] = useState(false);
  const invalidQuery = useInvalidateQuery();
  const { offer, offerId } = useOfferDetail();
  const { getOfferTitle } = useOfferLabels();

  const [selectedTab, setSelectedTab] = useState(
    defaultTab ?? TabValues.CANDIDATES
  );

  const goBack = () => {
    // Invalidate the offer list query to refresh the list
    invalidQuery(OFFER_LIST_QUERY_KEY);
    setIsVisible(false);
    setTimeout(() => {
      navigate(`/${RouteBreadcrumbs.OffersPage}`);
    }, 300);
  };

  useEffect(() => {
    offerId && setIsVisible(true);
  }, [offerId]);

  const tabs: Tab<TabValues>[] = useMemo(
    () => [
      {
        displayText: t('offer_candidates'),
        value: TabValues.CANDIDATES,
        icon: 'user',
        notifications:
          offer?.totalNewClaims && offer.totalNewClaims > 0
            ? offer.totalNewClaims
            : undefined,
      },
      {
        displayText: t('offer_details'),
        value: TabValues.DETAILS,
        icon: 'document',
      },
    ],
    [offer?.totalNewClaims, t]
  );

  useEffect(() => {
    if (accountInfo?.facilityGroup) {
      const selectedFacilityId = accountInfo.facilityGroup.facilities.find(
        (facility) => facility.selected
      )?.id;

      if (
        selectedFacilityId &&
        offer?.facilityId &&
        selectedFacilityId !== offer?.facilityId
      ) {
        mutate(+offer?.facilityId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer?.facilityId]);

  useEffect(() => {
    if (offer?.status === OfferStatus.DRAFT) setSelectedTab(TabValues.DETAILS);
  }, [offer?.status]);

  if (!offerId) {
    return null;
  }

  return (
    <div
      className={clsx(
        'absolute inset-0 flex max-h-screen justify-center overflow-hidden bg-BG-Default px-medium pb-xLarge transition-transform duration-300',
        isVisible ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex min-h-0 max-w-screen-lg flex-1 flex-col overflow-hidden">
        <ReturnButtonHeader
          goBack={goBack}
          title={getOfferTitle(
            offer?.livoUnit?.displayText,
            offer?.facilityType?.displayText,
            offer?.professionalField?.displayText
          )}
        />
        <NavigationTabs
          tabs={tabs}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <div className="flex min-h-0 flex-1">
          <OfferClaimsList hidden={selectedTab !== TabValues.CANDIDATES} />
          {selectedTab === TabValues.DETAILS && (
            <div className="flex min-h-0 max-w-full flex-1 md:pb-xLarge">
              <OfferInfoTab />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OfferDetailPage = () => {
  const offerId = useSearchParam('offerId');
  const defaultTab = useSearchParam('tab');

  return (
    <OfferDetailProvider offerId={offerId}>
      {offerId && (
        <OfferDetailView defaultTab={enumOf(TabValues, defaultTab)} />
      )}
    </OfferDetailProvider>
  );
};

export default OfferDetailPage;
