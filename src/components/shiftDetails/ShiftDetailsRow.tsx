import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface ShiftDetailsRowProps {
  iconName?: string;
  children: React.ReactNode;
  iconColor?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

export const ShiftDetailsRow: React.FC<ShiftDetailsRowProps> = ({
  iconName,
  children,
  iconColor,
  style,
  icon = null,
}) => {
  return (
    <div
      className="flex w-full flex-row items-start space-x-small"
      style={style}
    >
      <div className="flex items-start justify-center">
        {!!iconName && (
          <LivoIcon
            name={iconName}
            size={24}
            color={iconColor ? iconColor : colors['Grey-400']}
          />
        )}
        {icon}
      </div>
      <div className="body-sm flex flex-1 items-start space-x-small text-Text-Default">
        {children}
      </div>
    </div>
  );
};
