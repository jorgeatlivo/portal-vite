import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextFieldProps } from '@mui/material';

import PasswordInput from '@/components/form/PasswordInput';

type FormPasswordInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Pick<
  TextFieldProps,
  | 'label'
  | 'variant'
  | 'fullWidth'
  | 'className'
  | 'autoComplete'
  | 'placeholder'
>;

const FormPasswordInput = <T extends FieldValues>({
  control,
  name,
  ...textFieldProps
}: FormPasswordInputProps<T>) => {
  const { t } = useTranslation();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <PasswordInput
          inputRef={field.ref}
          disabled={field.disabled}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          {...textFieldProps}
          error={!!fieldState.error}
          helperText={t(fieldState.error?.message as never)}
        />
      )}
    />
  );
};

export default FormPasswordInput;
