import { useTranslation } from 'react-i18next';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface IncreaseCapacityProps {
  onClick: () => void;
}

export const IncreaseCapacity: React.FC<IncreaseCapacityProps> = ({
  onClick,
}) => {
  const { t } = useTranslation('shift-claim-details');
  return (
    <div className="flex size-full flex-row items-center space-x-small p-small">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-center rounded-[8px] bg-Primary-100 p-medium`}
      >
        <LivoIcon name="plus" size={24} color={colors['Primary-500']} />
      </button>
      <div className="flex w-full flex-col justify-center">
        <Typography variant="body/regular">
          {t('add_capacity_label')}
        </Typography>
      </div>
    </div>
  );
};
