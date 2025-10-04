import { useState } from 'react';

import { DropDownWithInput } from '@/components/publishShift/DropDownWithInput';

import { FacilityDataFieldDefinition } from '../../types/internal';

interface SingleSelectDataFieldProps {
  dataFieldDefinition: FacilityDataFieldDefinition;
  selectedValue: string;
  setSelectedValue: (selectedValue: string) => void;
  title: string;
  hasChanged?: boolean;
}

export const SingleSelectDataField: React.FC<SingleSelectDataFieldProps> = ({
  dataFieldDefinition,
  selectedValue,
  setSelectedValue,
  title,
  hasChanged,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <div className="w-full">
      <DropDownWithInput
        label={dataFieldDefinition.label}
        hasChanged={hasChanged}
        selectedOptionId={selectedValue}
        setOptionId={(optionId) => {
          setSelectedValue(optionId);
        }}
        placeHolder={dataFieldDefinition.label}
        options={dataFieldDefinition.options.map((option) => ({
          id: option.value,
          name: option.displayText,
        }))}
      />
    </div>
  );
};
