import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  icon?: ReactNode;
} & TextFieldProps;

const FormTextField = <T extends FieldValues>({
  control,
  name,
  icon,
  ...rest
}: FormTextFieldProps<T>) => {
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          inputRef={field.ref}
          error={!!fieldState.error}
          helperText={t(fieldState.error?.message as never)}
          InputProps={{
            startAdornment: icon && (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            ...rest.InputProps,
          }}
        />
      )}
    />
  );
};

export default FormTextField;
