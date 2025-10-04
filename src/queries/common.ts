import { ApiApplicationError } from '@/services/api';
import { CitiesResponse, getListSupportedCities } from '@/services/common';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import store from '@/store';

export const CITIES_OFFER_QUERY_KEY = 'CITIES_OFFER_QUERY_KEY';

function mapCitiesToOptions(cities: CitiesResponse) {
  return cities.map((city) => ({
    label: city.name,
    value: city.code,
  }));
}

export const queryFnCities = async ({ queryKey }: { queryKey: unknown[] }) => {
  try {
    const response = await getListSupportedCities();
    return mapCitiesToOptions(response);
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
