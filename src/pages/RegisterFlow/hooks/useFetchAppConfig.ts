import { useQuery } from '@tanstack/react-query';

import { getAccountConfig } from '@/services/authentication';

export const useFetchAppConfig = () => {
  const {
    isLoading,
    data: config = { facilityTypes: [] },
    error,
  } = useQuery({
    queryKey: ['FETCH_CONFIG'],
    queryFn: getAccountConfig,
  });

  return { config, error, isLoading };
};
