import { useTranslation } from 'react-i18next';

interface FilteredShiftsEmptyStateProps {
  onClick: () => void;
}
export const FilteredShiftsEmptyState: React.FC<
  FilteredShiftsEmptyStateProps
> = ({ onClick }) => {
  const { t } = useTranslation('shift-list');
  return (
    <div className="flex flex-col p-medium text-center">
      <p className="heading-md mb-small text-Text-Default">
        {t('filtered_empty_shifts_state_title')}
      </p>
      <p className="body-regular text-Text-Default">
        {t('filtered_empty_shifts_state_publish_shift_subtitle')}
      </p>
      <p className="cursor-pointer text-Primary-500" onClick={onClick}>
        {t('filtered_empty_shifts_state_publish_shift_button')}
      </p>
    </div>
  );
};
