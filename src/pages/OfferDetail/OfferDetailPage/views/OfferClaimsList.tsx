import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import clsx from 'clsx';

import LoadingView from '@/components/common/LoadingView';

import { OfferClaim } from '@/types/offers';

import useFetchOfferClaims from '@/pages/OfferDetail/hooks/useFetchOfferClaims';
import {
  FilterSelection,
  FiltersRow,
} from '@/pages/Offers/components/FilterRow';
import { OfferClaimCard } from '../components/OfferClaimCard';
import { OfferClaimCardCompact } from '../components/OfferClaimCardCompact';
import { OfferClaimDetail } from './OfferClaimDetail';

interface OfferCandidateListProps {
  hidden?: boolean;
}

export const OFFER_CANDIDATES_FILTER_SELECTIONS: FilterSelection[] = [
  {
    id: 'all',
    label: 'filter_all',
    mappingStatus: 'ALL',
  },
  {
    id: 'activeClaims',
    label: 'filter_active',
    mappingStatus: 'ACTIVE',
  },
  {
    id: 'discardedClaims',
    label: 'filter_discarded',
    mappingStatus: 'CLOSED',
  },
];
const smallScreen = window.innerWidth < 768;

export const OfferClaimsList: React.FC<OfferCandidateListProps> = ({
  hidden,
}) => {
  const { t } = useTranslation('offers');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<number | undefined | null>();
  const location = useLocation();
  const offerId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('offerId') ?? '';
  }, [location.search]);

  const { claimsResponse, isLoading, refetch } = useFetchOfferClaims(
    offerId,
    selectedFilter
  );

  const { rows: claims = [] } = claimsResponse ?? {};

  const selectedOfferClaim = useMemo(() => {
    return claims.find((claim) => claim.id === selectedId);
  }, [claims, selectedId]);

  const setSelectedOfferClaimId = (claim: OfferClaim) => {
    setSelectedId(claim.id);
  };

  return (
    <div
      className={clsx(
        `relative flex w-full flex-1 justify-center gap-5`,
        hidden ? 'hidden' : ''
      )}
    >
      <section
        className={clsx(
          'no-scrollbar transition-width flex h-full flex-col overflow-y-hidden transition duration-300',
          !!selectedOfferClaim ? 'w-[420px]' : 'w-full'
        )}
      >
        <FiltersRow
          selections={OFFER_CANDIDATES_FILTER_SELECTIONS}
          appliedFilter={selectedFilter}
          setFilter={(filter: string) => {
            setSelectedFilter(filter);
          }}
        />
        <div className="flex min-h-0 w-full flex-col gap-4 overflow-auto pb-4">
          {/* loading state */}
          {isLoading && <LoadingView />}

          {/* empty view */}
          {!isLoading && claims.length === 0 && (
            <div className="flex flex-col items-center p-medium text-center">
              <p className="heading-md mb-small text-Text-Default">
                {t('empty_offer_claim_title')}
              </p>
            </div>
          )}

          {/* list */}
          {!isLoading &&
            claims.length > 0 &&
            claims.map((claim) =>
              selectedOfferClaim?.id || smallScreen ? (
                <OfferClaimCardCompact
                  key={`claim-card-compact-${claim.id}`}
                  claim={claim}
                  isSelected={selectedOfferClaim?.id === claim.id}
                  selectClaim={setSelectedOfferClaimId}
                />
              ) : (
                <OfferClaimCard
                  key={`claim-card-${claim.id}`}
                  claim={claim}
                  isSelected={false}
                  selectClaim={setSelectedOfferClaimId}
                />
              )
            )}
        </div>
      </section>
      {selectedOfferClaim != null && (
        <OfferClaimDetail
          selectedOfferClaim={selectedOfferClaim}
          onClose={() => setSelectedId(undefined)}
          refreshClaims={refetch}
        />
      )}
    </div>
  );
};
