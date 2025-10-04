import { useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  UseFormTrigger,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ClickAwayListener,
  Collapse,
  IconButton,
  Paper,
  Popper,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { IconCalendarEvent } from '@tabler/icons-react';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';

import DialogConfirmButtons from '@/components/common/buttons/DialogConfirmButtons';
import RadioGroup from '@/components/form/RadioGroup';

import colors from '@/config/color-palette';

type FormDateCalendarProps<T extends FieldValues> = {
  name: Path<T>;
  optionName: Path<T>;
  control: Control<T>;
  label?: string;
  fullWidth?: boolean;
  className?: string;
  options: { label: string; value: string }[];
  trigger?: UseFormTrigger<T>;
  required?: boolean;
};

const getOptionLabel = (
  optionValue: string,
  options: { label: string; value: string }[]
) => {
  if (!optionValue || !options || optionValue === 'SPECIFIC_DATE') {
    return '';
  }

  return options?.find((option) => option.value === optionValue)?.label ?? '';
};

const getDateLabel = (dateValue?: string | null) => {
  return dateValue ? dayjs(dateValue).format('DD/MM/YYYY') : '';
};

const FormOptionDateCalendar = <T extends FieldValues>({
  name,
  optionName,
  control,
  label,
  fullWidth,
  className,
  options,
  trigger,
  required,
}: FormDateCalendarProps<T>) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    trigger?.(name);
    setOpen(false);
  };

  const onToggleOpen = () => {
    setOpen((prev) => {
      const _new = !prev;
      if (!_new) {
        trigger?.(name);
      }
      return _new;
    });
  };
  const anchorRef = useRef<HTMLDivElement | null>(null);
  return (
    <Controller
      name={optionName}
      control={control}
      render={({
        field: { onChange: oneChangeOption, value: optionValue },
        fieldState: { error: optionError },
      }) => {
        const optionLabel = getOptionLabel(optionValue, options);
        return (
          <Controller
            defaultValue={
              control._defaultValues[name] ?? ('' as PathValue<T, typeof name>)
            }
            name={name}
            control={control}
            render={({
              field: {
                value: dateValue,
                onChange: onChangeDate,
                onBlur: onBlurDate,
              },
              fieldState: { error: dateError },
            }) => {
              const contentWidth = anchorRef.current?.offsetWidth
                ? Math.min(
                    anchorRef.current?.offsetWidth,
                    Math.max(anchorRef.current?.offsetWidth / 2, 360)
                  )
                : 'auto';

              return (
                <>
                  <div className={clsx('w-full', className)} ref={anchorRef}>
                    <TextField
                      required={required}
                      fullWidth={fullWidth}
                      label={label}
                      value={optionLabel || getDateLabel(dateValue)}
                      onClick={onOpen}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton onClick={onToggleOpen}>
                            <IconCalendarEvent
                              size={24}
                              color={colors['Text-Subtle']}
                            />
                          </IconButton>
                        ),
                      }}
                      error={!!optionError || !!dateError}
                      helperText={t(
                        (optionError?.message || dateError?.message) as never
                      )}
                    />
                  </div>

                  <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    modifiers={[
                      {
                        name: 'preventOverflow',
                        options: {
                          boundary: 'window',
                        },
                      },
                      {
                        name: 'flip', // Cho phép lật popper lên trên nếu bị tràn xuống dưới
                        options: {
                          fallbackPlacements: ['top-start', 'top-end'],
                        },
                      },
                    ]}
                  >
                    <ClickAwayListener onClickAway={onClose}>
                      <Paper
                        elevation={3}
                        className={'modern-scrollbar gap-1'}
                        sx={{
                          width: contentWidth,
                          p: 2,
                          maxHeight: '50vh',
                          overflowY: 'auto',
                          transition: 'all 0.3s ease-in-out', // Add smooth transition
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <RadioGroup
                            value={optionValue ?? ''}
                            onChange={(value) => {
                              oneChangeOption(value);
                            }}
                            options={options ?? []}
                          />
                          <Collapse
                            in={optionValue === 'SPECIFIC_DATE'}
                            timeout="auto"
                          >
                            <DateCalendar
                              value={dateValue ? dayjs(dateValue) : null}
                              onChange={(newValue: Dayjs | null) => {
                                const __dateValue =
                                  newValue?.toISOString() ?? null;
                                onBlurDate();
                                onChangeDate(__dateValue);
                              }}
                            />
                          </Collapse>
                        </LocalizationProvider>

                        <DialogConfirmButtons
                          buttons={[
                            {
                              label: 'Cerrar',
                              onClick: onClose,
                            },
                            {
                              label: 'Guardar',
                              onClick: onClose,
                            },
                          ]}
                        />
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                </>
              );
            }}
          />
        );
      }}
    />
  );
};

export default FormOptionDateCalendar;
