import React, { useRef, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Stack,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { IconCalendarWeek } from '@tabler/icons-react';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';

type FormDateCalendarProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  fullWidth?: boolean;
  className?: string;
};

const FormDateCalendar = <T extends FieldValues>({
  name,
  control,
  label,
  fullWidth,
  className,
}: FormDateCalendarProps<T>) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <div className={clsx('w-full', className)} ref={anchorRef}>
            <TextField
              fullWidth={fullWidth}
              label={label}
              value={value ? dayjs(value).format('DD/MM/YYYY') : ''}
              onClick={() => setOpen(true)}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={() => setOpen((prev) => !prev)}>
                    <IconCalendarWeek />
                  </IconButton>
                ),
              }}
              error={!!error}
              helperText={t(error?.message as never)}
            />
          </div>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
          >
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={value ? dayjs(value) : null}
                    onChange={(newValue: Dayjs | null) => {
                      onChange(newValue ? newValue.toISOString() : null);
                    }}
                  />
                </LocalizationProvider>
                <Stack
                  direction="row"
                  justifyContent={'space-around'}
                  spacing={2}
                >
                  <Button onClick={() => setOpen(false)}>Cerrar</Button>
                  <Button onClick={() => setOpen(false)}>Guardar</Button>
                </Stack>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </>
      )}
    />
  );
};

export default FormDateCalendar;
