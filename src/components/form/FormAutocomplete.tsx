import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  AutocompleteProps,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { IconChevronDown } from '@tabler/icons-react';

import colors from '@/config/color-palette';

type FormAutocompleteProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  icon?: ReactNode;
} & Pick<
  TextFieldProps,
  'label' | 'variant' | 'fullWidth' | 'required' | 'disabled'
> &
  Pick<
    AutocompleteProps<any, false, false, false, 'div'>,
    | 'defaultValue'
    | 'options'
    | 'className'
    | 'clearIcon'
    | 'loading'
    | 'groupBy'
    | 'autoFocus'
  >;

const FormAutocomplete = <T extends FieldValues>({
  control,
  defaultValue,
  options,
  name,
  label,
  variant,
  fullWidth,
  className,
  clearIcon,
  loading,
  groupBy,
  required,
  autoFocus,
  disabled,
  icon,
}: FormAutocompleteProps<T>) => {
  const { t } = useTranslation();
  const _defaultValue = (control._defaultValues[name] || defaultValue) ?? null;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={_defaultValue}
      render={({ field, fieldState }) => (
        <Autocomplete
          autoFocus={autoFocus}
          disabled={disabled}
          popupIcon={
            <IconChevronDown size={24} color={colors['Text-Subtle']} />
          }
          fullWidth={fullWidth}
          loading={loading}
          groupBy={groupBy}
          defaultValue={_defaultValue}
          {...field}
          options={options}
          getOptionLabel={(option) => option?.label ?? ''}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(event, newValue) => field.onChange(newValue)}
          clearIcon={clearIcon}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              disabled={disabled}
              className={className}
              label={label}
              variant={variant}
              fullWidth={fullWidth}
              error={!!fieldState.error}
              helperText={t(fieldState.error?.message as never)}
              InputProps={{
                ...params.InputProps,
                startAdornment: icon ? (
                  <InputAdornment position="start">{icon}</InputAdornment>
                ) : undefined,
              }}
            />
          )}
        />
      )}
    />
  );
};

export default FormAutocomplete;
