import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  CreateOfferResponse,
  MutateOfferPayload,
  PublishOfferResponse,
} from '@/services/facility-offer';
import { OFFER_DETAIL_QUERY_ID } from '@/queries/offer-detail';
import {
  mutateCloseOffer,
  mutateCreateDraftOffer,
  mutateEditOffer,
  mutatePublishOffer,
} from '@/queries/offer-mutation';

import {
  ContractDurationType,
  ContractType,
  ScheduleType,
  StartDateType,
} from '@/types/offers';

import { OfferFormData } from '@/pages/OfferDetail/offer-form.config';

function mapRequirements(
  requirements: {
    livoUnit?: string;
    professionalField?: string;
    experience: string;
  }[]
) {
  return requirements.filter(
    (req) => !!req.livoUnit || !!req.professionalField
  );
}

function mapDuration(type: string = '', duration?: string) {
  if (!type && !duration) {
    return undefined;
  }

  return {
    type: type as ContractDurationType,
    date: duration,
  };
}

function mapPerks(perks: string[]) {
  // remove other flag before submit
  const traditionalValues = perks.filter((perk) => !perk.startsWith('other:'));
  const otherValues = perks.filter((perk) => perk.startsWith('other:'));
  const leanOtherValues = otherValues
    .map((perk) => {
      const [, , checked, ...value] = perk.split(':');
      if (checked === 'false') {
        return '';
      }

      return value.join(':');
    })
    .filter((other) => !!other);

  return [...traditionalValues, ...leanOtherValues];
}

function mapSalary(salaryInput?: string) {
  if (!salaryInput) {
    return undefined;
  }

  return parseFloat(salaryInput);
}

/**
 * build offer payload to submit create or edit offer
 */
export function buildOfferPayload(
  formData: OfferFormData,
  facilityId?: number
): MutateOfferPayload {
  return {
    category: formData.category?.value ?? '',
    contractType: formData.contractType as ContractType,
    startDate: {
      type: formData.startDateType as StartDateType,
      date: formData.startDate,
    },
    livoUnit: formData.livoUnit,
    professionalField: formData.professionalField,
    duration: mapDuration(formData.durationType, formData.duration),
    schedule: formData.schedule as ScheduleType[],
    scheduleDetails: formData.scheduleDetails,
    salaryMin: parseFloat(formData.salaryMin),
    salaryMax: mapSalary(formData.salaryMax),
    salaryPeriod: formData.salaryPeriod,
    salaryDetails: formData.salaryDetails,
    perks: mapPerks(formData.perks),
    requirements: formData.no_experience
      ? []
      : mapRequirements(formData.requirements),
    additionalRequirements: formData.additionalRequirements,
    details: formData.details,
    facilityId,
  };
}

export function usePublishOffer(params?: {
  onSuccess?: (params?: PublishOfferResponse) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();
  const {
    isPending,
    data: result,
    mutate: publishOffer,
    mutateAsync: publishOfferAsync,
    error,
  } = useMutation({
    mutationFn: mutatePublishOffer,
    onSuccess: (data) => {
      if (data?.offerId)
        queryClient.invalidateQueries({
          queryKey: [OFFER_DETAIL_QUERY_ID, data?.offerId.toString()],
        });
      params?.onSuccess?.(data);
    },
    onError: params?.onError,
  });

  return {
    isPending,
    result,
    error,
    publishOffer,
    publishOfferAsync,
  };
}

export function useSaveDraftOffer(params?: {
  onSuccess?: (params?: CreateOfferResponse) => void;
}) {
  const {
    isPending,
    data: result,
    // mutate: saveDraftOffer,
    mutateAsync: saveDraftOffer,
    error,
  } = useMutation({
    mutationFn: mutateCreateDraftOffer,
    onSuccess: params?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    saveDraftOffer,
  };
}

export function useEditOffer(params?: {
  onSuccess: (params?: { ok: boolean }) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: editOffer,
    mutateAsync: editOfferAsync,
    error,
  } = useMutation({
    mutationFn: mutateEditOffer,
    onSuccess: params?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    editOffer,
    editOfferAsync,
  };
}

export function useCloseOffer({
  onSuccess,
  onError,
}: {
  onSuccess?: (params?: { ok: boolean; offerId: number }) => void;
  onError?: (error: any) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: closeOffer,
    mutateAsync: closeOfferAsync,
    error,
  } = useMutation({
    mutationFn: mutateCloseOffer,
    onSuccess,
    onError,
  });

  return {
    isPending,
    result,
    error,
    closeOffer,
    closeOfferAsync,
  };
}
