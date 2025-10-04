import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import FiltersButton from '@/components/common/FiltersButton';
import SortingSelector, {
  SortingOptionsEnum,
} from '@/components/common/SortingSelector';
import { TagComponent } from '@/components/common/TagComponent';

import { FilterConfiguration } from '@/types/shifts';

interface FiltersRowProps {
  appliedFilter: string;
  setFilter: (filters: string) => void;
  onFiltersButtonClick: () => void;
  selectedSortingOption?: SortingOptionsEnum;
  sortingOptions?: SortingOptionsEnum[];
  setSelectedSortingOption?: (option: SortingOptionsEnum) => void;
}

export type FILTER_OPTION = {
  id: string;
  label: string;
  configuration: FilterConfiguration;
};

export const FILTER_CONFIGURATIONS: FILTER_OPTION[] = [
  {
    id: 'all',
    label: 'filter_all',
    configuration: {},
  },
  {
    id: 'pendingClaims',
    label: 'filter_requests',
    configuration: {
      withPendingClaims: true,
    },
  },
  {
    id: 'pendingToFill',
    label: 'filter_pending',
    configuration: {
      isFilled: false,
    },
  },
  {
    id: 'filled',
    label: 'filter_covered',
    configuration: {
      isFilled: true,
    },
  },
  {
    id: 'onboardingShifts',
    label: 'filter_onboarding',
    configuration: {
      onboardingShifts: true,
    },
  },
];
export const FiltersRow: React.FC<FiltersRowProps> = ({
  appliedFilter,
  setFilter,
  onFiltersButtonClick,
  selectedSortingOption,
  sortingOptions,
  setSelectedSortingOption,
}) => {
  const { t } = useTranslation('shift-list');
  const filters = useSelector((state: RootState) => state.filterShifts.filters);
  const selectedProfessionals = useSelector(
    (state: RootState) => state.filterShifts.selectedProfessionals
  );

  const numberOfAppliedFilters =
    filters.filter((f) => f.appliedOptions.length > 0).length +
    (selectedProfessionals.length > 0 ? 1 : 0);

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2 pb-large">
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_CONFIGURATIONS.map((filter) => (
          <TagComponent
            key={filter.id}
            label={t(filter.label as never)}
            onClick={() => setFilter(filter.id)}
            isSelected={appliedFilter.includes(filter.id)}
          />
        ))}
        {filters && filters.length > 0 && (
          <div>
            <FiltersButton
              onClick={onFiltersButtonClick}
              filters={filters}
              numberOfAppliedFilters={numberOfAppliedFilters}
            />
          </div>
        )}
      </div>

      {/* Sorting Selector */}
      {sortingOptions &&
        sortingOptions.length > 0 &&
        selectedSortingOption &&
        setSelectedSortingOption && (
          <SortingSelector
            selectedOption={selectedSortingOption}
            options={sortingOptions}
            onChange={(option) =>
              setSelectedSortingOption(option as SortingOptionsEnum)
            }
          />
        )}
    </div>
  );
};
