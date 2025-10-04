import { ApiApplicationError } from '@/services/api';
import {
  contactLivo,
  contactLivoOnboardingShift,
} from '@/services/facility-offer';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import { SubscriptionStatus } from '@/types/offers';

import store from '@/store';

export const OFFER_CONFIG_QUERY_KEY = 'offer-config';

export const PUBLISH_OFFER_KEY = 'publish-offer';

export const postContactLivo = async ({
  reason,
  source,
}: {
  reason?: SubscriptionStatus;
  source: 'OFFER_PUBLISHING' | 'OFFER_LISTING' | 'ZOMBIE_OFFER';
}) => {
  try {
    if (!reason) throw new Error('Reason is required');
    await contactLivo(reason, source);
    return { ok: true };
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

export const postContactLivoOnboardingShift = async ({
  coverageShiftId,
  coverageShiftClaimId,
}: {
  coverageShiftId: number;
  coverageShiftClaimId?: number | null;
}) => {
  try {
    await contactLivoOnboardingShift(coverageShiftId, coverageShiftClaimId);
    return { ok: true };
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
