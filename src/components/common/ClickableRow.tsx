import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface ClickableRowProps {
  leftIcon?: string;
  text: string;
  rightIcon?: string;
  iconSize?: number;
  leftIconColor?: string;
  rightIconColor?: string;
  onClick?: () => void;
}

export default function ClickableRow({
  leftIcon,
  text,
  rightIcon,
  onClick,
  iconSize,
  leftIconColor,
  rightIconColor,
}: ClickableRowProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-row items-center justify-between
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <div className="flex flex-row items-center gap-small">
        {leftIcon && (
          <LivoIcon
            name={leftIcon}
            size={iconSize ?? 24}
            color={leftIconColor ?? colors['Grey-400']}
          />
        )}
        <Typography color={colors['Primary-500']} variant={'action/regular'}>
          {text}
        </Typography>
      </div>

      {rightIcon ? (
        <LivoIcon
          name={rightIcon}
          size={iconSize ?? 24}
          color={rightIconColor ?? colors['Primary-500']}
        />
      ) : (
        <LivoIcon
          name="chevron-right"
          size={iconSize ?? 24}
          color={rightIconColor ?? colors['Primary-500']}
        />
      )}
    </div>
  );
}
