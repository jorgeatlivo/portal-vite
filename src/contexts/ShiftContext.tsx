import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ShiftState {
  tab: string;
  selectedShiftId: number | undefined;
  selectedClaimId: number | null;
}

interface ShiftActions {
  setTab: (selectedTab: string) => void;
  setSelectedShiftId: (shiftId: number | undefined) => void;
  setSelectedClaimId: (claimId: number | null) => void;
}

type ShiftContextType = ShiftState & ShiftActions;

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

interface ShiftProviderProps {
  children: ReactNode;
}

export const ShiftProvider: React.FC<ShiftProviderProps> = ({ children }) => {
  // Initial state
  const [tab, setTab] = useState<string>('all');
  const [selectedShiftId, setSelectedShiftId] = useState<number | undefined>();
  const [selectedClaimId, setSelectedClaimId] = useState<number | null>(null);

  const contextValue: ShiftContextType = {
    // State
    tab,
    selectedShiftId,
    selectedClaimId,

    // Actions
    setTab,
    setSelectedShiftId,
    setSelectedClaimId,
  };

  return (
    <ShiftContext.Provider value={contextValue}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShiftContext = (): ShiftContextType => {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error('useShiftContext must be used within a ShiftProvider');
  }
  return context;
};
