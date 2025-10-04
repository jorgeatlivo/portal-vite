import { ApiApplicationError } from '@/services/api';
import { shiftClaimAccept } from '@/services/claims';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import store from '@/store';

export const mutateAcceptClaim = async (payload: {
  shiftId: number;
  shiftClaimId: number;
  reason?: string;
  comment?: string;
  skipConstraints?: boolean;
}) => {
  try {
    const {
      shiftId,
      shiftClaimId,
      reason,
      comment,
      skipConstraints = false,
    } = payload;
    const response = await shiftClaimAccept(
      shiftId,
      shiftClaimId,
      reason,
      comment,
      skipConstraints
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
    } else {
      throw error;
    }
  }
};
