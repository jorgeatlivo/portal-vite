import { Box, Checkbox, FormControlLabel } from '@mui/material';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { modalityTags } from '@/utils/constants';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';

interface VisibilityItemProps {
  isSelected: boolean;
  modality: ShiftModalityEnum;
  onPress: (select: boolean) => void;
  disabled?: boolean;
}

export const VisibilityItem: React.FC<VisibilityItemProps> = ({
  isSelected,
  modality,
  onPress,
  disabled = false,
}) => {
  const modalityProps = modalityTags[modality];

  return (
    <Box
      className={clsx(
        'flex h-14 w-full flex-row items-center justify-between space-x-small rounded-lg border  px-small',
        { 'border-Neutral-300': isSelected, 'opacity-50': disabled }
      )}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={isSelected}
            disabled={disabled}
            onChange={(e) => onPress(e.target.checked)}
            className={clsx({ 'text-gray-400': !isSelected || disabled })}
            sx={{
              color:
                isSelected && !disabled
                  ? modalityProps.color
                  : colors['Grey-400'],
              '&.Mui-checked': {
                color:
                  isSelected && !disabled
                    ? modalityProps.color
                    : colors['Grey-400'],
              },
            }}
          />
        }
        label={
          <Box
            className={clsx('flex flex-row items-center space-x-tiny', {
              'opacity-50': disabled,
            })}
          >
            <LivoIcon
              name={modalityProps.icon}
              color={disabled ? colors['Grey-400'] : modalityProps.color}
              size={24}
            />
            <Typography
              variant="body/regular"
              className={clsx({ 'text-gray-400': disabled })}
            >
              {modalityProps.displayText}
            </Typography>
          </Box>
        }
        className={clsx('!m-0 w-full flex-1 justify-between', {
          'cursor-not-allowed': disabled,
        })}
        labelPlacement="start"
        disabled={disabled}
      />
    </Box>
  );
};
