import { useEffect, useRef } from 'react';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  FillRatePredictionParams,
  fetchShiftFillRateProbabilities,
} from '@/services/fill-rate';

import { useDebounceValues } from './useDebounceValues';

export const FETCH_FILL_RATE_PREDICTION = 'FETCH_FILL_RATE_PREDICTION';

export const useFetchFillRatePrediction = (
  params: Omit<FillRatePredictionParams, 'temporalId'>
) => {
  const queryClient = useQueryClient();
  const temporalId = useRef<string | undefined>();
  const debouncedValues = useDebounceValues(params);

  const queryData = useQuery({
    queryKey: [
      FETCH_FILL_RATE_PREDICTION,
      JSON.stringify(debouncedValues),
      temporalId.current,
    ],
    queryFn: () =>
      fetchShiftFillRateProbabilities({
        ...debouncedValues,
        temporalId: temporalId.current,
      }),
    enabled: !!params.category && !!params.startTime,
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (!temporalId.current && queryData.data?.temporalId) {
    temporalId.current = queryData.data.temporalId;
  }

  useEffect(
    () => () => {
      queryClient.removeQueries({ queryKey: [FETCH_FILL_RATE_PREDICTION] });
      temporalId.current = undefined;
    },
    [queryClient]
  );

  return queryData;
};
