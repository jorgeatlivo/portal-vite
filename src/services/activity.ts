import { Shift } from '@/types/shifts';

import { api, handleApiError } from './api';

export function fetchActionableShifts(): Promise<Shift[]> {
  const uri = '/facility/portal/shifts/actionable-shifts';

  return api
    .get(uri)
    .then((response) => {
      return response.data || [];
    })
    .catch(handleApiError);
}
