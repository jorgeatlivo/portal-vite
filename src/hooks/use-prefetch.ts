import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { TIME } from '@/queries/gc-time.enum';

export default function usePrefetch<T>() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    ({
      queryKey,
      queryFn,
    }: {
      queryKey: unknown[];
      queryFn: ({
        queryKey,
      }: {
        queryKey: unknown[];
      }) => Promise<T | undefined>;
    }) => {
      queryClient.prefetchQuery({
        queryKey,
        networkMode: 'online',
        gcTime: TIME['1_hour'],
        staleTime: TIME['1_hour'],
        queryFn,
      });
    },
    [queryClient]
  );

  return prefetch;
}
