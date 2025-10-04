import { useTranslation } from 'react-i18next';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface EmptyCapacityClaimProps {
  onClick: () => void;
  editable: boolean;
}

export const EmptyCapacityClaim: React.FC<EmptyCapacityClaimProps> = ({
  onClick,
  editable,
}) => {
  const { t } = useTranslation('shift-claim-details');
  return (
    <div className="flex size-full flex-row items-center space-x-small p-small">
      <div
        className={`flex items-center justify-center rounded-[8px] bg-Neutral-100 p-medium`}
      >
        <LivoIcon size={24} name="user-search" color={colors['Grey-700']} />
      </div>
      <div className="flex w-full flex-col justify-center">
        <Typography variant="body/regular">
          {t('pending_to_fill_capacity_item')}
        </Typography>
      </div>
      {editable ? (
        <button
          type="button"
          className="flex items-center justify-center"
          onClick={onClick}
        >
          <LivoIcon name="trash" size={24} color={colors['Grey-400']} />
        </button>
      ) : null}
    </div>
  );
};
