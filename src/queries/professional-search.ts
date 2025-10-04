import { ApiApplicationError } from '@/services/api';
import {
  fetchProfessionalProfile,
  searchProfessionals,
} from '@/services/professionals';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import store from '@/store';

export const PROFESSIONAL_SEARCH_QUERY_KEY = 'professionals';
export const PROFESSIONAL_PROFILE_QUERY_KEY = 'professional-profile';

export const queryFnProfessionalSearch = async ({
  queryKey,
}: {
  queryKey: unknown[];
}) => {
  const [, searchTerm] = queryKey;
  try {
    const response = await searchProfessionals({
      name: (searchTerm as string)?.toLowerCase(),
    });
    return response.professionals;
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

export const queryFnProfessionalProfile = async ({
  queryKey,
}: {
  queryKey: unknown[];
}) => {
  const [, professionalId] = queryKey;
  try {
    const response = await fetchProfessionalProfile(
      professionalId as string | number
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
