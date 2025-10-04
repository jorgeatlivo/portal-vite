import { useTranslation } from 'react-i18next';

import {
  Filter,
  FilterOption,
  getOptionToDisplayText,
} from '@/types/common/shiftFilters';

import DropDownWithInput from './DropDownWithInput';
import { TagLabel } from './TagLabel';

interface FilterComponentProps {
  filter: Filter;
  selectOptionInFilter: (filter: Filter, option: FilterOption) => void;
  unselectOptionInFilter: (filter: Filter, option: FilterOption) => void;
  clearSelectedOptionsInFilter: (filter: Filter) => void;
}

export function FilterComponent({
  filter,
  selectOptionInFilter,
  unselectOptionInFilter,
  clearSelectedOptionsInFilter,
}: FilterComponentProps) {
  const { t } = useTranslation('shift-claim-list');
  return (
    <div className="mb-medium">
      <div className="flex flex-row justify-between">
        <h1 className="subtitle-regular mb-small">{filter.name}</h1>
        {filter.selectedOptions.length > 0 && (
          <p
            className="cursor-pointer text-Primary-500"
            onClick={() => clearSelectedOptionsInFilter(filter)}
          >
            {t('clean_filter_label')}
          </p>
        )}
      </div>
      <div className="mb-small flex flex-wrap">
        {filter.selectedOptions.map((option) => (
          <div className="my-[2px] mr-tiny">
            <TagLabel
              text={getOptionToDisplayText(filter)(option)}
              onRemove={() => unselectOptionInFilter(filter, option)}
            />
          </div>
        ))}
      </div>
      <div className="mb-medium">
        <DropDownWithInput
          options={filter.options.filter(
            (option) => !filter.selectedOptions.includes(option)
          )}
          placeholder={t('search_label') + ' ' + filter.name.toLowerCase()}
          storeParentOption={(option) => selectOptionInFilter(filter, option)}
          optionToString={getOptionToDisplayText(filter)}
          useFloating={true}
        />
      </div>
    </div>
  );
}
