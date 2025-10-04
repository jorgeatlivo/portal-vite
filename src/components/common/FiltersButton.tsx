import { useTranslation } from 'react-i18next';

import { ActionButton } from '@/components/common/ActionButton';
import LivoIcon from '@/components/common/LivoIcon';

import { Filter } from '@/types/common/shiftFilters';

import colors from '@/config/color-palette';

interface FiltersButtonProps {
  filters: Filter[];
  numberOfAppliedFilters: number;
  onClick: () => void;
}

export default function FiltersButton({
  onClick,
  filters,
  numberOfAppliedFilters,
}: FiltersButtonProps) {
  const { t } = useTranslation('shift-claim-list');
  return (
    <ActionButton
      onClick={onClick}
      isLoading={false}
      color={colors['Neutral-050']}
      tailwindStyle={'pl-tiny gap-2'}
    >
      <LivoIcon name="filter" size={16} color={colors['Secondary-900']} />
      <p className="action-regular text-Secondary-900">
        {numberOfAppliedFilters > 0 ? t('filters_label') : t('filter_label')}
      </p>
      {numberOfAppliedFilters > 0 && (
        <span className="flex size-[20px] items-center justify-center rounded-full bg-Secondary-900">
          <span className="ml-[-2px] text-s01">{numberOfAppliedFilters}</span>
        </span>
      )}
    </ActionButton>
  );
}
