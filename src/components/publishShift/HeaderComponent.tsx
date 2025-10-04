import { IconButton } from '@mui/material';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface HeaderComponentProps {
  title: string;
  onClose?: () => void;
  goBack?: () => void;
}

// TODO - Refactor as ModalHeader to avoid confusion & move somewhere more fitting
export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  onClose,
  goBack,
}) => {
  return (
    <div className="flex w-full flex-row items-center justify-between border-b border-Divider-Default px-medium py-small">
      {goBack ? (
        <IconButton onClick={goBack}>
          <LivoIcon size={24} name="chevron-left" color={colors['Grey-950']} />
        </IconButton>
      ) : (
        <div className="w-xLarge" />
      )}
      <Typography variant="heading/small">{title}</Typography>
      <IconButton onClick={onClose}>
        <LivoIcon name={'close'} size={24} color={colors['Text-Subtle']} />
      </IconButton>
    </div>
  );
};
