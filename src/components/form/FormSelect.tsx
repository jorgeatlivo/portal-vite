import { HTMLProps, ReactNode, useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Typography,
} from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import clsx from 'clsx';

import colors from '@/config/color-palette';

export type FormSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
  separator?: boolean;
};

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: FormSelectOption[];
  className?: HTMLProps<HTMLDivElement>['className'];
  showNotSelected?: boolean;
  disabled?: boolean;
  onChange?: (event: SelectChangeEvent<PathValue<T, Path<T>>>) => void;
  icon?: ReactNode;
} & Pick<SelectProps, 'label' | 'required'>;

const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  className,
  disabled,
  showNotSelected = false,
  required,
  onChange: onChangeProp,
  icon,
}: FormSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common');
  return (
    <div className={clsx('w-full', className)}>
      <Controller
        name={name}
        control={control}
        disabled={disabled}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { error },
        }) => (
          <FormControl fullWidth error={!!error} disabled={disabled}>
            <InputLabel required={required} id={`label-${name}`}>
              {label}
            </InputLabel>
            <Select
              disabled={disabled}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              IconComponent={() => (
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {open ? (
                    <IconChevronUp size={24} color={colors['Text-Subtle']} />
                  ) : (
                    <IconChevronDown size={24} color={colors['Text-Subtle']} />
                  )}
                </div>
              )}
              labelId={`label-${name}`}
              label={label}
              onChange={(e) => {
                onChange(e);
                onChangeProp?.(e);
              }}
              onBlur={onBlur}
              value={value}
              inputRef={ref}
              startAdornment={
                icon ? (
                  <InputAdornment position="start">{icon}</InputAdornment>
                ) : undefined
              }
            >
              {showNotSelected && (
                <MenuItem value="">
                  <em>{t('no_option_selected')}</em>
                </MenuItem>
              )}

              {value !== undefined &&
                value !== '' &&
                !options.some((o) => o.value === String(value)) && (
                  <MenuItem
                    value={value}
                    key={`select-${name}-missing-value`}
                    sx={{ display: 'none' }}
                  >
                    {String(value)}
                  </MenuItem>
                )}
              {options.flatMap((option) => {
                const arr = [
                  <MenuItem
                    disabled={option.disabled}
                    key={`select-${name}-${option.value}`}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>,
                ];
                if (option.separator) {
                  arr.push(<Divider key={`${option.value}-divider`} />);
                }
                return arr;
              })}
            </Select>
            {error && (
              <Typography
                className="absolute -bottom-6 !mx-[14px]"
                variant="caption"
                color="error"
              >
                {t(error.message as never)}
              </Typography>
            )}
          </FormControl>
        )}
      />
    </div>
  );
};

export default FormSelect;
