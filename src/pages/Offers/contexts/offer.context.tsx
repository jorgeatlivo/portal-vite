import React, { createContext, useContext, useState } from 'react';

import { OfferSubscription } from '@/types/offers';

interface OfferFilter {
  search?: string;
  status?: string;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  // Add more filter properties as needed
}

interface OfferContextType {
  selectedFilter: OfferFilter;
  slots?: OfferSubscription;
  setSlots: (slots?: OfferSubscription) => void;
  setFilter: (filter: OfferFilter) => void;
}

const OfferContext = createContext<OfferContextType | undefined>(undefined);

export const OfferProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<OfferFilter>({});
  const [slots, setSlots] = useState<OfferSubscription | undefined>();

  const setFilter = (filter: OfferFilter) => {
    setSelectedFilter(filter);
  };

  return (
    <OfferContext.Provider
      value={{ selectedFilter, setFilter, slots, setSlots }}
    >
      {children}
    </OfferContext.Provider>
  );
};

export const useOfferContext = () => {
  const context = useContext(OfferContext);
  if (context === undefined) {
    throw new Error('useOfferContext must be used within an OfferProvider');
  }
  return context;
};
