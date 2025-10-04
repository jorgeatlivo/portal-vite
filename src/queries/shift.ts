import { ApiApplicationError } from '@/services/api';
import {
  CheckEligibleProfessionalsRequest,
  checkEligibleProfessionals,
  fetchPublishShiftConfiguration,
  fetchShiftInvitation,
  publishShift,
  ShiftPublicationRequest,
} from '@/services/publish-shift';
import {
  ShiftUpdateRequest,
  updateShiftRequest,
} from '@/services/shifts-calendar';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import { ShiftInvitationRequest } from '@/types/shift-invitation';

import store from '@/store';

export const QUERY_PUBLISH_SHIFT_CONFIG = 'publish-shift-config';
export const QUERY_SHIFT_INVITATION = 'shift-invitation';
export const QUERY_CHECK_ELIGIBLE_PROFESSIONALS =
  'check-eligible-professionals';

export async function queryFnPublishShiftConfig({
  queryKey,
}: {
  queryKey: unknown[];
}) {
  const [_, category = ''] = queryKey || [];

  try {
    const response = await fetchPublishShiftConfiguration(category as string);
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
}

export async function mutatePublishShift(payload: ShiftPublicationRequest) {
  try {
    await publishShift(payload);
    return true;
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
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function mutateEditShift(payload: {
  shiftId: number;
  shiftRequest: ShiftUpdateRequest;
}) {
  try {
    await updateShiftRequest(payload.shiftId, payload.shiftRequest);
    return true;
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
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function queryFnShiftInvitation({
  queryKey,
}: {
  queryKey: unknown[];
}) {
  const [_, request] = queryKey as [string, ShiftInvitationRequest];

  try {
    const response = await fetchShiftInvitation(request);
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
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function queryFnCheckEligibleProfessionals({
  queryKey,
}: {
  queryKey: unknown[];
}) {
  const [_, request] = queryKey as [string, CheckEligibleProfessionalsRequest];

  try {
    const response = await checkEligibleProfessionals(request);
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
    throw error; // Re-throw the error to be handled by the caller
  }
}
