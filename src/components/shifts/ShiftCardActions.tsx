import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface ShiftCardActionsProps {
  actionComponents: {
    iconName: string;
    onClick: () => void;
  }[];
}

export const ShiftCardActions: React.FC<ShiftCardActionsProps> = ({
  actionComponents,
}) => {
  return (
    <div className="flex space-x-small rounded-[100px] bg-white px-small py-tiny shadow-custom">
      {actionComponents.map((actionComponent, index) => (
        <button
          type="button"
          key={index}
          onClick={actionComponent.onClick}
          className="flex items-center justify-center"
        >
          <LivoIcon
            size={16}
            name={actionComponent.iconName}
            color={colors['Grey-700']}
          />
        </button>
      ))}
    </div>
  );
};
