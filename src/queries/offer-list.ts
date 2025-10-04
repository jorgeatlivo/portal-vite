import { ApiApplicationError } from '@/services/api';
import { fetchOffers } from '@/services/offers';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import store from '@/store';

export const OFFER_LIST_QUERY_KEY = 'OFFER_LIST_QUERY_KEY';

export const queryFnOfferList = async () => {
  try {
    const response = await fetchOffers();
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
