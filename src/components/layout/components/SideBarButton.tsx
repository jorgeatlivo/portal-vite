import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { NotificationsBadge } from '../../common/NotificationsBadge';

interface SideBarButtonProps {
  isFocused: boolean;
  onClick: () => void;
  label: string;
  expanded: boolean;
  notifications?: number;
  smallLabel?: boolean;
  iconName: string;
  imgUrl?: string;
  chevron?: boolean;
}

export const SideBarButton: React.FC<SideBarButtonProps> = ({
  isFocused,
  onClick,
  label,
  smallLabel,
  expanded,
  imgUrl,
  iconName,
  notifications,
  chevron,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      `relative flex w-full flex-row items-center justify-between gap-1 rounded-[8px] transition-colors duration-300 ease-in-out`,
      isFocused ? `bg-Primary-100` : `hover:bg-[#006778]`,
      imgUrl ? 'p-tiny' : 'p-small'
    )}
  >
    <div className={'flex w-[200px] flex-row overflow-hidden'}>
      <div className={'flex shrink-0 flex-row  items-center gap-2'}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="Facility logo"
            className={clsx(
              'size-[40px] rounded-full border-2',
              isFocused ? 'border-Secondary-900' : 'border-white'
            )}
          />
        ) : (
          <LivoIcon
            name={iconName}
            size={32}
            color={colors[isFocused ? 'Secondary-900' : 'Neutral-000']}
          />
        )}
        <Typography
          variant={
            smallLabel
              ? 'body/small'
              : isFocused
                ? 'subtitle/regular'
                : 'body/regular'
          }
          className={clsx(
            'line-clamp-2 !w-[125px]',
            isFocused ? 'text-Secondary-900' : 'text-white'
          )}
        >
          {label}
        </Typography>

        {chevron && (
          <LivoIcon
            name={'chevron-right'}
            size={28}
            color={colors[isFocused ? 'Secondary-900' : 'Neutral-000']}
          />
        )}
      </div>
    </div>
    {notifications ? (
      <div className={clsx(!expanded && 'absolute right-[-5px] top-0')}>
        <NotificationsBadge notifications={notifications} />
      </div>
    ) : null}
  </button>
);
