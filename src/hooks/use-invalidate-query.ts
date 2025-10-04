import { useQueryClient } from '@tanstack/react-query';

import { Logger } from '@/services/logger.service';

/**
 * Hook to invalidate queries
 * @returns Function to invalidate queries
 */
export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();

  const invalidateQuery = async (queryKey: unknown | unknown[]) => {
    try {
      await queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      });
    } catch (error) {
      Logger.error('Error invalidating query:', error);
    }
  };

  return invalidateQuery;
};
