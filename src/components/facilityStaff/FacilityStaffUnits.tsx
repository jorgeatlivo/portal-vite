import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FacilityUnit } from '@/services/facility-staff';

import LivoIcon from '@/components/common/LivoIcon';
import { TagLabel } from '@/components/common/TagLabel';
import { DropDownWithInput } from '@/components/publishShift/DropDownWithInput';

import colors from '@/config/color-palette';

interface FacilityStaffUnitsProps {
  addUnit: (unit: string) => void;
  availableUnits: FacilityUnit[];
  removeUnit: (unit: string) => void;
  units: string[];
}

export const FacilityStaffUnits: React.FC<FacilityStaffUnitsProps> = ({
  addUnit,
  availableUnits,
  removeUnit,
  units,
}) => {
  const { t } = useTranslation('facility-staff');
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const mappedUnits = units
    .map((unit) => availableUnits.find((u) => u.value === unit))
    .filter((unit) => unit) as FacilityUnit[];
  const selectableUnits = availableUnits
    .filter((unit) => !units.find((u) => u === unit.value))
    .map((unit) => ({
      id: unit.value,
      name: unit.displayName,
    }));
  return (
    <div>
      <p className="subtitle-regular">{t('units_label')}</p>
      <p className="body-regular text-Text-Subtle">{t('units_to_show')}</p>
      <div className="flex items-center space-x-tiny py-medium">
        {units.length ? (
          mappedUnits.map((unit, index) => (
            <TagLabel
              key={index}
              text={unit.displayName}
              onRemove={() => removeUnit(unit.value)}
            />
          ))
        ) : (
          <p className="body-regular text-Text-Subtle">
            {t('no_units_selected')}
          </p>
        )}
      </div>
      <div>
        {selectableUnits.length > 0 ? (
          isAddingUnit ? (
            <div className="mb-medium">
              <DropDownWithInput
                setOptionId={(optionId) => {
                  addUnit(optionId);
                  setIsAddingUnit(false);
                }}
                selectedOptionId={''}
                autoFocus={true}
                placeHolder={t('form_select_unit')}
                options={selectableUnits}
              />
            </div>
          ) : (
            <div className="py-[6px]">
              <button
                type="button"
                onClick={() => setIsAddingUnit(true)}
                className="flex cursor-pointer items-center space-x-tiny rounded-full py-[6px] pl-medium pr-small ring-2 ring-Primary-500"
              >
                <p className="body-regular text-Primary-500">{t('add_unit')}</p>
                <LivoIcon name="plus" size={24} color={colors['Primary-500']} />
              </button>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
