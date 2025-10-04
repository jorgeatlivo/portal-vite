import { Dispatch } from 'redux';

import {
  fetchInternalProfessionals,
  InternalProfessionalFilter,
} from '@/services/api';
import { Logger } from '@/services/logger.service';

import { InvitationStatus } from '@/types/internal';

export const setPendingRequestsCount = (count: number) => ({
  type: 'SET_PENDING_REQUESTS_COUNT',
  payload: count,
});

export const fetchPendingRequests = () => async (dispatch: Dispatch) => {
  const filter: InternalProfessionalFilter = {
    invitationStatus: InvitationStatus.PENDING,
  };
  try {
    const response = await fetchInternalProfessionals(filter);
    dispatch(setPendingRequestsCount(response.total));
  } catch (error) {
    Logger.error('fetchPendingRequests', error);
  }
};
