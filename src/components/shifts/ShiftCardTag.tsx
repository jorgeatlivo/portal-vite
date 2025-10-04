import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface ShiftCardTagProps {
  totalPendingClaims: number;
  isFilled: boolean;
  isSelected?: boolean;
}
const HiddenPlaceholder = () => <div className="size-6 opacity-0" />;

const CheckIcon = () => (
  <LivoIcon size={24} name="circle-check-filled" color={colors['Green-500']} />
);

const PendingClaimsBadge = ({ count }: { count: number }) => (
  <div className="flex size-5 items-center justify-center rounded-full bg-Negative-500">
    <Typography
      variant="subtitle/small"
      className="text-center leading-none text-white"
    >
      {count > 99 ? '99+' : count}
    </Typography>
  </div>
);

export const ShiftCardTag: React.FC<ShiftCardTagProps> = ({
  totalPendingClaims,
  isFilled,
  isSelected,
}) => {
  const renderContent = () => {
    if (isSelected) {
      return <HiddenPlaceholder />;
    }

    if (isFilled) {
      return <CheckIcon />;
    }

    if (totalPendingClaims > 0) {
      return <PendingClaimsBadge count={totalPendingClaims} />;
    }

    return <HiddenPlaceholder />;
  };

  return (
    <div className={'flex size-6 items-center justify-center'}>
      {renderContent()}
    </div>
  );
};
