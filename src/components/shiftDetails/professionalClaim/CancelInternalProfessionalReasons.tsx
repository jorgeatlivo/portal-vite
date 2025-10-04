import React, { useEffect, useState } from 'react';

import { CustomInput } from '@/components/common/CustomInput';

interface CancelInternalProfessionalClaimReasonsProps {
  onSelectReason: (reason: string) => void;
  selectedReason: string;
}

export const CancelInternalProfessionalClaimReasons: React.FC<
  CancelInternalProfessionalClaimReasonsProps
> = ({ onSelectReason, selectedReason }) => {
  const [inputValue, setInputValue] = useState(selectedReason);

  useEffect(() => {
    onSelectReason(inputValue);
  }, [inputValue, onSelectReason]);

  return (
    <div className="p-y-large flex flex-col">
      <CustomInput
        placeHolder="¿Por qué quieres cancelar?"
        selectedValue={inputValue}
        setValue={setInputValue}
      />
    </div>
  );
};
