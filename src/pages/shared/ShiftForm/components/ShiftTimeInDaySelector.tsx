import { useTranslation } from 'react-i18next';

import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { ShiftTimeInDayEnum } from '@/types/shifts';

import colors from '@/config/color-palette';
import { SHIFT_TIME_IN_DAY_DEFINITIONS } from '@/utils';

interface ShiftInDaySelectorProps {
  shiftTimeInDay?: string;
  setShiftTimeInDay: (shiftTimeInDay: string) => void;
  disabled?: boolean;
}

export const ShiftTimeInDaySelector: React.FC<ShiftInDaySelectorProps> = ({
  shiftTimeInDay,
  setShiftTimeInDay,
  disabled,
}) => {
  const { t } = useTranslation('calendar');

  return (
    <Box
      className={clsx(
        'flex h-fit w-full flex-col rounded-lg border border-solid border-Divider-Default p-4',
        disabled && 'opacity-60'
      )}
    >
      <FormControl
        component="fieldset"
        className="flex w-full flex-col"
        disabled={disabled}
      >
        <RadioGroup
          value={shiftTimeInDay || ''}
          onChange={(event) => setShiftTimeInDay(event.target.value)}
          className="gap-2"
        >
          {Object.keys(SHIFT_TIME_IN_DAY_DEFINITIONS).map((key) => {
            const props =
              SHIFT_TIME_IN_DAY_DEFINITIONS[key as ShiftTimeInDayEnum];
            return (
              <FormControlLabel
                key={`shift-time-in-day-${key}`}
                value={props.hashKey}
                control={
                  <Radio
                    icon={
                      <LivoIcon
                        name="circle"
                        size={24}
                        color={colors['Grey-400']}
                      />
                    }
                    checkedIcon={
                      <LivoIcon
                        name="radio-filled"
                        size={24}
                        color={colors['Primary-500']}
                      />
                    }
                  />
                }
                label={
                  <span
                    className={clsx(
                      'flex items-center justify-start gap-2',
                      disabled && 'text-gray-400'
                    )}
                  >
                    <LivoIcon name={props.icon} size={24} color={props.color} />
                    <Typography variant="body/regular">
                      {t(props.name as never)}
                    </Typography>
                  </span>
                }
                className={clsx(
                  '!m-0 w-full flex-row-reverse justify-between rounded-lg',
                  shiftTimeInDay === props.hashKey && 'bg-blue-50'
                )}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                    ml: 2,
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
