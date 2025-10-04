import { useCallback, useLayoutEffect, useState } from 'react';

import { APIService, APIServiceName } from '@/services/api.service';

import { clearFilterStorage } from '@/utils/filterStorage';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  useLayoutEffect(() => {
    token &&
      APIService.getInstance(APIServiceName.AUTHORIZED).updateConfig({
        token: token ? token : undefined,
      });
  }, [token]);

  const saveToken = useCallback((userToken: string) => {
    APIService.getInstance(APIServiceName.AUTHORIZED).updateConfig({
      token: userToken,
    });
    localStorage.setItem('token', userToken);
    setToken(userToken);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('i18nextLng');
    clearFilterStorage();
    setToken(null);
  }, []);

  return {
    setToken: saveToken,
    token,
    logOut,
  };
}
