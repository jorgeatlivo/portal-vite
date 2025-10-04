import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ClickAwayListener, Popper, TextField } from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import clsx from 'clsx';

import {
  AnimatedPaper,
  useAnimatedPaper,
} from '@/components/common/animation/AnimatedPaper';
import DialogConfirmButtons from '@/components/common/buttons/DialogConfirmButtons';

import colors from '@/config/color-palette';
import SelectCheckbox, { Option } from './SelectCheckbox';

type FormSelectCheckboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
  options: Option[];
  placeholder?: string;
  label?: string;
  required?: boolean;
};

function FormSelectCheckbox<T extends FieldValues>({
  control,
  name,
  multiple = false,
  options,
  placeholder,
  label,
  required,
}: FormSelectCheckboxProps<T>) {
  const { t } = useTranslation();
  const { anchorRef, open, transitioning, handleClose, toggleOpenClose } =
    useAnimatedPaper<HTMLElement>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedValues = Array.isArray(value) ? (value as string[]) : [];
        const displayLabel = selectedValues
          .map(
            (val) =>
              options.find((opt) => opt.value === val)?.label || '(No Name)'
          )
          .join(', ');

        const handleCheckBoxChange = (vals: string[]) => {
          onChange(vals);
        };

        return (
          <div className="relative w-full">
            {/* The text field acts as the trigger for the dropdown */}
            <TextField
              multiline
              maxRows={2}
              required={required}
              label={label}
              className="w-full"
              placeholder={placeholder}
              value={displayLabel}
              onClick={toggleOpenClose}
              InputProps={{
                endAdornment: open ? (
                  <IconChevronUp size={24} color={colors['Text-Subtle']} />
                ) : (
                  <IconChevronDown size={24} color={colors['Text-Subtle']} />
                ),
                readOnly: true,
              }}
              error={!!error}
              helperText={t(error?.message as never)}
            />

            {/* Render the Popper only when `anchorRef.current` is available */}
            {anchorRef.current && (
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                disablePortal
                sx={{ zIndex: 9999 }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <AnimatedPaper
                    className={clsx(
                      open && !transitioning ? 'popper-enter' : 'popper-exit',
                      '!min-w-72 p-4'
                    )}
                  >
                    <SelectCheckbox
                      multiple={multiple}
                      values={selectedValues}
                      onChange={handleCheckBoxChange}
                      options={options}
                    />
                    <DialogConfirmButtons
                      buttons={[
                        {
                          label: 'Cerrar',
                          onClick: () => {
                            onChange([]);
                            handleClose();
                          },
                        },
                        {
                          label: 'Guardar',
                          onClick: handleClose,
                        },
                      ]}
                    />
                  </AnimatedPaper>
                </ClickAwayListener>
              </Popper>
            )}
          </div>
        );
      }}
    />
  );
}

export default FormSelectCheckbox;
