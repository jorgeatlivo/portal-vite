import { useTranslation } from 'react-i18next';

import { TagComponent } from '@/components/common/TagComponent';

interface FiltersRowPros {
  selections: FilterSelection[];
  appliedFilter: string;
  setFilter: (filters: string) => void;
}

export interface FilterSelection {
  id: string;
  label: string;
  mappingStatus: string;
}

export const FiltersRow: React.FC<FiltersRowPros> = ({
  selections,
  appliedFilter,
  setFilter,
}) => {
  const { t } = useTranslation('offers');
  return (
    <div className="flex w-full flex-wrap items-center gap-2 p-px pb-large">
      {selections.map((filter, index) => (
        <TagComponent
          key={index}
          label={t(filter.label as never)}
          isSelected={appliedFilter === filter.id}
          onClick={() => {
            setFilter(filter.id);
          }}
        />
      ))}
    </div>
  );
};
