import React, { createContext, useContext, useRef } from 'react';

type BeforeSwitchInterceptor = () => Promise<boolean>; // true = allow, false = block

const AccountChangeInterceptorContext = createContext<{
  setInterceptor: (fn: BeforeSwitchInterceptor | null) => void;
  getInterceptor: () => BeforeSwitchInterceptor | null;
}>({
  setInterceptor: () => {},
  getInterceptor: () => null,
});

export const AccountChangeInterceptorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const interceptorRef = useRef<BeforeSwitchInterceptor | null>(null);

  return (
    <AccountChangeInterceptorContext.Provider
      value={{
        setInterceptor: (fn) => (interceptorRef.current = fn),
        getInterceptor: () => interceptorRef.current,
      }}
    >
      {children}
    </AccountChangeInterceptorContext.Provider>
  );
};

export const useAccountChangeInterceptor = () =>
  useContext(AccountChangeInterceptorContext);
