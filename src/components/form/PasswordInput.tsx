import React, { FC, useState } from 'react';

import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

import colors from '@/config/color-palette';

type PasswordInputProps = Omit<TextFieldProps, 'type'> & {
  inputRef?: TextFieldProps['inputRef'];
};

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <TextField
      {...props}
      inputRef={props.inputRef}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              onClick={togglePasswordVisibility}
              edge="end"
            >
              {showPassword ? (
                <IconEye size={24} color={colors['Text-Subtle']} />
              ) : (
                <IconEyeOff size={24} color={colors['Text-Subtle']} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
