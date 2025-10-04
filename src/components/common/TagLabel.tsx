import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface TagLabelProps {
  text: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  style?: any;
  backgroundColor?: string;
  onRemove?: () => void;
  closeColor?: string;
  small?: boolean;
}

export const TagLabel: React.FC<TagLabelProps> = ({
  text,
  icon,
  color,
  iconColor,
  backgroundColor = colors['Neutral-100'],
  closeColor = colors['Grey-700'],
  onRemove,
  small,
  style,
}) => {
  return (
    <div
      className={`flex flex-row items-center space-x-tiny rounded-[4px] px-[6px] py-[2px] ${style}`}
      style={{
        backgroundColor: backgroundColor,
        color: color,
      }}
    >
      {icon ? (
        <LivoIcon
          name={icon}
          size={16}
          color={iconColor || colors['Grey-700']}
        />
      ) : null}
      <Typography variant={small ? 'body/small' : 'info/caption'} noWrap>
        {text}
      </Typography>
      {onRemove ? (
        <div
          onClick={onRemove}
          className="flex cursor-pointer items-center justify-center"
        >
          <LivoIcon name="close" size={24} color={closeColor} />
        </div>
      ) : null}
    </div>
  );
};
