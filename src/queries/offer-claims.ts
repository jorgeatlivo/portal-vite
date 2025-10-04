import { ApiApplicationError } from '@/services/api';
import { fetchOfferClaims } from '@/services/offers';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import { OFFER_CANDIDATES_FILTER_SELECTIONS } from '@/pages/OfferDetail/OfferDetailPage/views/OfferClaimsList';
import store from '@/store';

export const OFFER_CLAIMS_QUERY_ID = 'offer-claims';

export const queryFnOfferClaims = async ({
  queryKey,
}: {
  queryKey: unknown[];
}) => {
  const [, offerId, filterStr] = queryKey;
  try {
    const filterStatus = OFFER_CANDIDATES_FILTER_SELECTIONS.find(
      (filter) => filter.id === (filterStr as string)
    )?.mappingStatus;

    // TODO: Uncomment this when the API is ready
    const response = await fetchOfferClaims(
      Number.parseInt((offerId as string) ?? ''),
      filterStatus
    );

    return response;
  } catch (error) {
    if (error instanceof ApiApplicationError) {
      if (error.cause === 'NO_INTERNET') {
        store.dispatch(toggleInternetConnection(false));
      } else {
        store.dispatch(
          showToastAction({
            message: error.message,
            severity: 'error',
          })
        );
      }
    }
  }
};
