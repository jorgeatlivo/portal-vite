import { useMutation, useQueryClient } from '@tanstack/react-query';

import { handleApiError } from '@/services/api';
import { updateSelectedFacility } from '@/services/facility';
import { OFFER_LIST_QUERY_KEY } from '@/queries/offer-list';
import { OFFER_CONFIG_QUERY_KEY } from '@/queries/offer-mutation';

import { FETCH_ACCOUNT_INFO_ID } from '@/routers/hooks/useFetchAccountInfo';

export const useUpdateFacility = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (facilityId: number) => updateSelectedFacility(facilityId),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: [OFFER_LIST_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [OFFER_CONFIG_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [FETCH_ACCOUNT_INFO_ID] }),
      ]).then(() => onSuccess?.());
    },
    onError: handleApiError,
  });
};
