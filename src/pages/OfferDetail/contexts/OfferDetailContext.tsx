import React, { createContext, useContext } from 'react';

import { OfferDetail } from '@/types/offers';

import useFetchOfferDetail from '@/pages/OfferDetail/hooks/useFetchOfferDetail';

interface OfferDetailContextType {
  offerId?: string;
  offer?: OfferDetail;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const OfferDetailContext = createContext<OfferDetailContextType | undefined>({
  offerId: undefined,
  offer: undefined,
  isLoading: false,
  error: null,
  refetch: () => {},
});

export const OfferDetailProvider: React.FC<{
  children: React.ReactNode;
  offerId?: string;
}> = ({ children, offerId }) => {
  const { offer, isLoading, error, refetch } = useFetchOfferDetail(
    offerId ?? ''
  );

  const value = {
    offerId,
    offer,
    isLoading,
    error,
    refetch,
  };

  return (
    <OfferDetailContext.Provider value={value}>
      {children}
    </OfferDetailContext.Provider>
  );
};

export const useOfferDetail = (): OfferDetailContextType => {
  const context = useContext(OfferDetailContext);
  if (context === undefined) {
    throw new Error(
      'useOfferDetail must be used within an OfferDetailProvider'
    );
  }
  return context;
};
