import { Chip } from '@mui/material';

interface CapacityItemProps {
  isSelected: boolean;
  capacity: number;
  onPress: (capacity: number) => void;
  disabled?: boolean;
}

export const CapacityItem: React.FC<CapacityItemProps> = ({
  isSelected,
  capacity,
  onPress,
  disabled = false,
}) => {
  return (
    <Chip
      label={capacity}
      onClick={() => !disabled && onPress(capacity)}
      variant={isSelected ? 'filled' : 'outlined'}
      color={isSelected ? 'primary' : 'default'}
      clickable={!disabled}
      disabled={disabled}
      className="!h-12 !w-12 !rounded-full"
    />
  );
};
