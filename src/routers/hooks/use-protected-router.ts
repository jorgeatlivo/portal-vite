import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import { protectedRoutes } from '@/routers/config';

export const useProtectedRoutes = () => {
  const { accountInfo } = useSelector((state: RootState) => state.account);

  return useMemo(
    () =>
      protectedRoutes?.filter((route) =>
        accountInfo?.visibleTabMenu.includes(route.id)
      ),
    [accountInfo?.visibleTabMenu]
  );
};
