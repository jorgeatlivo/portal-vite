import { api, handleApiError } from './api';

export const updateSelectedFacility = (facilityId: number) => {
  const uri = '/facility/portal/account/update-selected-facility';

  return api
    .post(uri, { facilityId })
    .then((response) => response.status === 200)
    .catch(handleApiError);
};
