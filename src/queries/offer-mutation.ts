import { ApiApplicationError } from '@/services/api';
import {
  closeOffer,
  createDraftOffer,
  EditOfferPayload,
  editOffer,
  getFacilityConfig,
  MutateOfferPayload,
  publishOffer,
} from '@/services/facility-offer';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';

import { FacilityConfig, Perk } from '@/types/offers';

import store from '@/store';

export const OFFER_CONFIG_QUERY_KEY = 'offer-config';

export const PUBLISH_OFFER_KEY = 'publish-offer';

export const PerkIcon = new Map([
  ['PROFESSIONAL_CAREER', 'rocket'],
  ['CONTINUING_EDUCATION', 'books'],
  ['DAYCARE_VOUCHER', 'baby-carriage'],
  ['INSURANCE', 'percentage'],
  ['SCHOLARSHIP', 'graduation-hat'],
  ['uniform', 'uniform'],
  ['parking', 'parking'],
  ['meal', 'meal'],
  ['locker', 'locker'],
]);

export function mapPerks(perks: Perk[]) {
  return perks.map((perk) => ({
    label: perk.displayText,
    value: perk.value,
    icon: perk.icon ?? PerkIcon.get(perk.value),
  }));
}

export function mapOfferConfigToFormValues(config: FacilityConfig) {
  return {
    categories: config.categories.map((category) => ({
      label: category.displayText,
      value: category.value,
    })),
    units: config.livoUnits.map((livoUnit) => ({
      label: livoUnit.displayText,
      value: livoUnit.value,
    })),
    professionalFields: config.professionalFields.map((professionalField) => ({
      label: professionalField.displayText,
      value: professionalField.value,
    })),
    startDate: config.startDate.map((startDate) => ({
      label: startDate.displayText,
      value: startDate.value,
    })),
    durationTypes: config.durationTypes.map((durationType) => ({
      label: durationType.displayText,
      value: durationType.value,
    })),
    contractTypes: config.contractTypes.map((contractType) => ({
      label: contractType.displayText,
      value: contractType.value,
    })),
    contractSchedules: config.contractSchedules.map((contractSchedule) => ({
      label: contractSchedule.displayText,
      value: contractSchedule.value,
    })),
    salaryPeriods: config.salaryPeriods.map((salaryPeriod) => ({
      label: salaryPeriod.displayText,
      value: salaryPeriod.value,
    })),
    perks: mapPerks(config.perks),
    skillExperience: config.skillExperience.map((skillExperience) => ({
      label: skillExperience.displayText,
      value: skillExperience.value,
    })),
  };
}

export type FormConfig = ReturnType<typeof mapOfferConfigToFormValues>;

export const queryFnOfferConfig = async () => {
  try {
    const response = await getFacilityConfig();
    return mapOfferConfigToFormValues(response);
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

export const mutateCreateDraftOffer = async (payload: MutateOfferPayload) => {
  try {
    const response = await createDraftOffer(payload);
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

export const mutatePublishOffer = async (offerId: number) => {
  try {
    const response = await publishOffer(offerId);
    return response;
  } catch (error) {
    if (error instanceof ApiApplicationError) {
      if (error.cause === 'NO_INTERNET') {
        store.dispatch(toggleInternetConnection(false));
        return;
      }

      if (error.errorCode?.startsWith('4017')) {
        throw error;
      }

      store.dispatch(
        showToastAction({
          message: error.message,
          severity: 'error',
        })
      );
    }
  }
};

export const mutateCloseOffer = async (offerId: number) => {
  try {
    await closeOffer(offerId);
    return { ok: true, offerId };
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
    throw error;
  }
};

export const mutateEditOffer = async ({
  offerId,
  payload,
}: {
  offerId: number;
  payload: EditOfferPayload;
}) => {
  try {
    await editOffer(offerId, payload);
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
