import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Box, InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';

interface PublishShiftInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeHolder?: string;
  label?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export const PublishShiftMultipleLineInput = <T extends FieldValues>({
  name,
  control,
  placeHolder,
  label,
  disabled = false,
  icon,
}: PublishShiftInputProps<T>) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value = '', onChange }, fieldState }) => (
        <Box className="w-full">
          <TextField
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeHolder}
            label={label}
            multiline
            rows={4}
            error={!!fieldState.error}
            helperText={
              fieldState.error ? t(fieldState.error.message as never) : ''
            }
            fullWidth
            variant="outlined"
            className="min-h-[113px]"
            InputProps={{
              className: 'max-h-[300px] min-h-[113px] items-start pt-small',
              startAdornment: icon ? (
                <InputAdornment position="start">{icon}</InputAdornment>
              ) : undefined,
            }}
            InputLabelProps={{
              className: clsx(
                disabled ? 'text-Text-Light' : 'text-Text-Subtle'
              ),
            }}
            sx={{
              '& .MuiFormHelperText-root.Mui-error': {
                color: '#fa3d3b',
                marginTop: '4px',
              },
            }}
          />
        </Box>
      )}
    />
  );
};
