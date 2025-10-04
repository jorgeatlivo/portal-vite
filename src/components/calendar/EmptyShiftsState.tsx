import { useTranslation } from 'react-i18next';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface EmptyShiftsStateProps {
  date: string;
  shiftTimeInDay: string;
  onClick: () => void;
}
export const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({
  date,
  shiftTimeInDay,
  onClick,
}) => {
  const { t } = useTranslation('calendar');
  return (
    <div
      className="relative rounded-[16px] bg-white pl-small"
      style={{
        minWidth: '176px',
      }}
    >
      <div className="flex flex-col gap-tiny p-medium">
        <Typography variant="body/regular" color={colors['Text-Default']}>
          {t('empty_shifts_state_title')}&nbsp;
        </Typography>

        <Typography variant="body/regular" color={colors['Text-Default']}>
          {t('empty_shifts_state_publish_shift_subtitle')}
          <span className="cursor-pointer text-Primary-500" onClick={onClick}>
            +
          </span>
          {t('empty_shifts_state_publish_shift_subtitle_2')}
        </Typography>
      </div>
    </div>
  );
};
