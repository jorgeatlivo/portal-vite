import { Dispatch } from 'redux';

import { fetchActionableShifts } from '@/services/activity';
import { Logger } from '@/services/logger.service';

import { Shift } from '@/types/shifts';

export const setActivityShiftListShifts = (shifts: Shift[]) => {
  return {
    type: 'SET_ACTIVITY_SHIFT_LIST_SHIFTS',
    payload: shifts,
  };
};

export const fetchActivity =
  () =>
  async (dispatch: Dispatch): Promise<Shift[]> => {
    return fetchActionableShifts()
      .then((response) => {
        dispatch(setActivityShiftListShifts(response));
        return response;
      })
      .catch((error) => {
        Logger.error('fetchActionableShifts', error);
        return [];
      });
  };
