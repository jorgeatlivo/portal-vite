import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import FiltersButton from '@/components/common/FiltersButton';
import { NotificationsBadge } from '@/components/common/NotificationsBadge';

import { TagComponent } from '../../components/common/TagComponent';
import { FilterConfiguration } from '../../types/shifts';
import FilterProfessionalsModal from './FilterProfessionalsModal';

interface ProfessionalFilterProps {
  setFilter: (filters: string) => void;
  appliedFilter: string;
  nPendingClaims: number | null;
}
export const FILTER_CONFIGURATIONS: {
  id: string;
  label: string;
  configuration: FilterConfiguration;
}[] = [
  {
    id: 'all',
    label: 'filter_all',
    configuration: {},
  },
  {
    id: 'pending',
    label: 'filter_requests',
    configuration: {
      withPendingClaims: true,
    },
  },
];
export const ProfessionalFilter: React.FC<ProfessionalFilterProps> = ({
  setFilter,
  appliedFilter,
  nPendingClaims,
}) => {
  const { t } = useTranslation('internal-professional-page');
  const filters = useSelector(
    (state: RootState) => state.professionalFilters.filters
  );
  const numberOfAppliedFilters = filters.filter(
    (f) => f.appliedOptions.length > 0
  ).length;
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      {FILTER_CONFIGURATIONS.map((filter, index) => (
        <TagComponent
          key={index}
          label={t(filter.label as never)}
          onClick={() => setFilter(filter.id)}
          isSelected={appliedFilter.includes(filter.id)}
          style={
            filter.id === 'pending' && nPendingClaims
              ? { padding: '8px' }
              : undefined
          }
        >
          {filter.id === 'pending' && nPendingClaims ? (
            <NotificationsBadge
              notifications={nPendingClaims}
              style={{
                marginLeft: '4px',
                marginTop: '-2px',
                marginBottom: '-2px',
              }}
            />
          ) : null}
        </TagComponent>
      ))}
      {filters && filters.length > 0 && (
        <div>
          <FiltersButton
            onClick={() => setFilterModalOpen(true)}
            filters={filters}
            numberOfAppliedFilters={numberOfAppliedFilters}
          />
        </div>
      )}

      <FilterProfessionalsModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      />
    </div>
  );
};
