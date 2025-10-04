import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MultiSelectModal } from '@/components/common/MultiSelectModal';

import { DataFieldOption, FacilityDataFieldDefinition } from '@/types/internal';

import colors from '@/config/color-palette';

interface MultiSelectDataFieldProps {
  dataFieldDefinition: FacilityDataFieldDefinition;
  selectedValues: string[];
  setSelectedValues: (selectedValues: string[]) => void;
  title: string;
  hasChanged?: boolean;
}

export const MultiSelectDataField: React.FC<MultiSelectDataFieldProps> = ({
  dataFieldDefinition,
  selectedValues,
  setSelectedValues,
  title,
  hasChanged,
}) => {
  const { t } = useTranslation('common');
  const [modalVisible, setModalVisible] = useState(false);
  const label =
    dataFieldDefinition.label && selectedValues && selectedValues.length > 0
      ? dataFieldDefinition.label
      : title;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setModalVisible(true)}
        className="relative w-full"
      >
        <div className="absolute -top-small left-small bg-white px-tiny">
          <p className="info-overline text-Text-Subtle">{label}</p>
        </div>

        <div className="ring-solif flex w-full items-center space-x-small rounded-[8px] px-small py-medium text-left ring-1 ring-Divider-Default">
          {hasChanged ? (
            <div className="size-small rounded-full bg-Primary-500" />
          ) : null}
          <div className="shrink-1 mr-tiny flex-1 overflow-hidden">
            <p
              className="body-regular flex-1 truncate"
              style={{
                color:
                  selectedValues.length > 0 ? undefined : colors['Grey-000'],
              }}
            >
              {selectedValues.length > 0
                ? dataFieldDefinition.options
                    .filter((option: DataFieldOption) =>
                      selectedValues.includes(option.value)
                    )
                    .map((option: DataFieldOption) => option.displayText)
                    .join(', ')
                : dataFieldDefinition.label}
            </p>
          </div>
          {/* <LivoIcon name="chevron-down" color={colors["Text-Default"]} size={24} /> */}
        </div>
      </button>
      <MultiSelectModal
        onSubmit={(selectedOptions: string[]) => {
          setSelectedValues(selectedOptions);
          setModalVisible(false);
        }}
        isOpen={modalVisible}
        title={title}
        options={dataFieldDefinition.options.map((option: DataFieldOption) => ({
          label: option.displayText,
          value: option.value,
        }))}
        goBackText={t('go_back')}
        buttonText={t('accept')}
        initialSelection={selectedValues}
        goBack={() => setModalVisible(false)}
      />
    </div>
  );
};
