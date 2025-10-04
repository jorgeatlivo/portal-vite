import { useTranslation } from 'react-i18next';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

export const PastEmptyShiftsState = () => {
  const { t } = useTranslation('calendar');
  return (
    <div
      className="relative rounded-[16px] bg-white pl-small"
      style={{
        minWidth: '176px',
      }}
    >
      <div className="flex flex-col p-medium">
        <Typography variant="body/regular" color={colors['Text-Default']}>
          {t('past_empty_shifts_state_title')}
        </Typography>
      </div>
    </div>
  );
};
