import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

export default function useRefetch() {
  const queryClient = useQueryClient();

  const refetch = useCallback(
    ({ queryKey }: { queryKey: unknown[] }) => {
      return queryClient.refetchQueries({
        queryKey,
      });
    },
    [queryClient]
  );

  return refetch;
}
