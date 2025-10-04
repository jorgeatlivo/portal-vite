import React from 'react';

import {
  FormControl,
  FormControlLabel,
  RadioGroup as MuiRadioGroup,
  Radio,
  Typography,
} from '@mui/material';
import clsx from 'clsx';

import colors from '@/config/color-palette';

type FormRadioGroupProps = {
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
};

const RadioGroup: React.FC<FormRadioGroupProps> = ({
  value,
  options,
  onChange,
}) => {
  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <MuiRadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        sx={{ width: '100%' }}
      >
        {options?.map((option) => (
          <FormControlLabel
            key={`radio-${option.value}`}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: '#9CA3AF',
                  '&.Mui-checked': { color: colors['Primary-500'] },
                }}
              />
            }
            label={
              <Typography
                className={clsx(
                  'text-gray-500',
                  option.value === value && 'font-medium text-gray-900'
                )}
              >
                {option.label}
              </Typography>
            }
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
};

export default RadioGroup;
