import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { CheckEligibleProfessionalsRequest } from '@/services/publish-shift';
import { TIME } from '@/queries/gc-time.enum';
import {
  mutateEditShift,
  mutatePublishShift,
  QUERY_CHECK_ELIGIBLE_PROFESSIONALS,
  QUERY_PUBLISH_SHIFT_CONFIG,
  QUERY_SHIFT_INVITATION,
  queryFnCheckEligibleProfessionals,
  queryFnPublishShiftConfig,
  queryFnShiftInvitation,
} from '@/queries/shift';

import { CategoryCode } from '@/types/common/category';
import {
  ShiftInvitationConfig,
  ShiftInvitationRequest,
  ShiftInvitationSearch,
} from '@/types/shift-invitation';

export function usePublishShiftConfig(categoryCode?: CategoryCode) {
  const {
    isLoading,
    data: config,
    error,
  } = useQuery({
    queryKey: [QUERY_PUBLISH_SHIFT_CONFIG, categoryCode],
    networkMode: 'online',
    staleTime: TIME['30_seconds'],
    gcTime: TIME['1_minute'],
    queryFn: queryFnPublishShiftConfig,
    enabled: !!categoryCode,
  });

  return { isLoading, config, error };
}

export function useMutatePublishShift(callbacks?: {
  onSuccess?: (response: boolean) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: publishShift,
    mutateAsync: publishShiftAsync,
    error,
  } = useMutation({
    mutationFn: mutatePublishShift,
    onSuccess: callbacks?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    publishShift,
    publishShiftAsync,
  };
}

export function useMutateEditShift(callbacks?: {
  onSuccess?: (response: boolean) => void;
}) {
  const {
    isPending,
    data: result,
    mutate: editShift,
    mutateAsync: editShiftAsync,
    error,
  } = useMutation({
    mutationFn: mutateEditShift,
    onSuccess: callbacks?.onSuccess,
  });

  return {
    isPending,
    result,
    error,
    editShift,
    editShiftAsync,
  };
}

export function useFetchShiftInvitation(
  shiftConfig?: ShiftInvitationConfig,
  search?: ShiftInvitationSearch,
  size: number = 20,
  enabled: boolean = true,
  uniqueKey?: string
) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [QUERY_SHIFT_INVITATION, shiftConfig, search, size, uniqueKey],
    networkMode: 'online',
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: TIME['1_minute'],
    gcTime: TIME['1_minute'],
    queryFn: ({ pageParam = 1 }) => {
      const request: ShiftInvitationRequest = {
        shiftConfig: shiftConfig!,
        search: search || { selectedProfessionalIds: [] },
        page: pageParam,
        size,
      };
      return queryFnShiftInvitation({
        queryKey: [QUERY_SHIFT_INVITATION, request],
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.finalPage) {
        return undefined;
      }
      return (lastPage?.page || 0) + 1;
    },
    enabled: !!shiftConfig && enabled,
  });

  // Flatten all pages into a single array of professionals
  const professionals =
    data?.pages.flatMap((page) => page?.professionals || []) || [];

  return {
    professionals,
    isLoading: status === 'pending',
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    totalCount: data?.pages[0]?.total || 0,
  };
}

export function useCheckEligibleProfessionals(
  request?: CheckEligibleProfessionalsRequest,
  enabled: boolean = true
) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [QUERY_CHECK_ELIGIBLE_PROFESSIONALS, request],
    networkMode: 'online',
    staleTime: 0, // Always refetch when called
    gcTime: TIME['30_seconds'],
    queryFn: queryFnCheckEligibleProfessionals,
    enabled: !!request && enabled,
  });

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
