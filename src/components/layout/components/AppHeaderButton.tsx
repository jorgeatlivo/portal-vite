import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import { NotificationsBadge } from '@/components/common/NotificationsBadge';

import colors from '@/config/color-palette';

interface Props {
  isFocused: boolean;
  onClick: () => void;
  label: string;
  notifications?: number;
  smallLabel?: boolean;
  iconName: string;
  imgUrl?: string;
}

export const AppHeaderButton: React.FC<Props> = ({
  isFocused,
  onClick,
  label,
  smallLabel,
  iconName,
  notifications,
  imgUrl,
}) => {
  const itemsColor = colors['Secondary-900'];

  return (
    <div
      className={clsx(
        'w-full px-large ',
        isFocused
          ? 'border-top-px -mt-px border-Primary-100 bg-Primary-100 pb-px'
          : 'bg-white hover:bg-Neutral-050'
      )}
    >
      <button
        onClick={onClick}
        className={clsx(
          'flex w-full flex-row items-center justify-between py-medium',
          !isFocused && ' border-b'
        )}
      >
        <div className="flex flex-row items-center gap-4">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt="Facility logo"
              className={
                'size-[40px] rounded-full border-2 border-Secondary-900'
              }
            />
          ) : (
            <LivoIcon name={iconName!} size={32} color={itemsColor} />
          )}
          <Typography
            variant={
              smallLabel
                ? 'body/small'
                : isFocused
                  ? 'subtitle/regular'
                  : 'body/regular'
            }
            color={itemsColor}
          >
            {label}
          </Typography>
          {notifications ? (
            <NotificationsBadge notifications={notifications} />
          ) : null}
        </div>
        <LivoIcon name={'chevron-right'} size={28} color={itemsColor} />
      </button>
    </div>
  );
};
