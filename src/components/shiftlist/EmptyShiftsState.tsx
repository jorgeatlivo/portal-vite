import { useTranslation } from 'react-i18next';

interface EmptyShiftsStateProps {
  onClick: () => void;
}
export const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({
  onClick,
}) => {
  const { t } = useTranslation('shift-list');
  return (
    <div className="flex flex-col items-center p-medium text-center">
      <p className="heading-md mb-small text-Text-Default">
        {t('empty_shifts_state_title')}
      </p>
      <p className="body-regular text-Text-Default">
        {t('empty_shifts_state_publish_shift_subtitle')}
        <span className="cursor-pointer text-Primary-500" onClick={onClick}>
          {t('empty_shifts_state_publish_shift_button')}
        </span>
        {t('empty_shifts_state_publish_shift_subtitle_2')}
      </p>
    </div>
  );
};
