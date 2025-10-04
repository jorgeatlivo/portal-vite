import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface InformationRowProps {
  iconName: string;
  children: React.ReactNode;
  iconColor?: string;
  style?: any;
}

export const InformationRow: React.FC<InformationRowProps> = ({
  iconName,
  children,
  iconColor,
  style,
}) => {
  return (
    <div
      className="flex w-full flex-row items-start space-x-small"
      style={style}
    >
      <div className="flex items-center justify-center">
        <LivoIcon
          name={iconName}
          size={24}
          color={iconColor ? iconColor : colors['Grey-400']}
        />
      </div>
      <div className="body-sm flex flex-1 items-center space-x-small overflow-hidden pt-1 text-Text-Default">
        {children}
      </div>
    </div>
  );
};
