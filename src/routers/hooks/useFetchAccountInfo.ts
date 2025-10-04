import { useQuery } from '@tanstack/react-query';

import { fetchAccountInfo } from '@/services/account';

export const FETCH_ACCOUNT_INFO_ID = 'FETCH_ACCOUNT_INFO_ID';

export const useFetchAccountInfo = (token: string | null) => {
  const {
    isLoading,
    data: accountInfo,
    error,
  } = useQuery({
    queryKey: [FETCH_ACCOUNT_INFO_ID, token],
    queryFn: () => (token ? fetchAccountInfo() : null),
    refetchOnWindowFocus: false,
    retry: true,
  });

  return { isLoading, accountInfo, error };
};
