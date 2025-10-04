import { ApiApplicationError } from '@/services/api';
import { fetchOfferDetail } from '@/services/offers';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import store from '@/store';

export const OFFER_DETAIL_QUERY_ID = 'offer-detail';

export const queryFnOfferDetail = async ({
  queryKey,
}: {
  queryKey: unknown[];
}) => {
  const [, offerId] = queryKey;
  try {
    const response = await fetchOfferDetail(
      Number.parseInt((offerId as string) ?? '')
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
