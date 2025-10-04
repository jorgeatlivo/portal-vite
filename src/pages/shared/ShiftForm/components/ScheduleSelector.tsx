import { useCallback } from 'react';
import { Control, Controller, FieldPathValue, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputAdornment, TextField } from '@mui/material';
import { IconClock } from '@tabler/icons-react';

import { day, setTime } from '@/utils/datetime';

import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';

interface ScheduleSelectorProps {
  disabled?: boolean;
  control: Control<ShiftFormData>;
  startTimeName: Path<ShiftFormData>;
  endTimeName: Path<ShiftFormData>;
}

const CLOCK_ADORNMENT = (
  <InputAdornment position="start">
    <IconClock size={20} className="text-gray-400" />
  </InputAdornment>
);

const isValidTimeValue = (value: unknown): value is string =>
  Boolean(value && typeof value === 'string');

const formatTimeForInput = (value: unknown): string =>
  isValidTimeValue(value) ? day(value).format('HH:mm') : '';

const createTimeFromInput = (
  timeString: string,
  currentValue: unknown
): string | null => {
  if (!timeString) return null;

  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  const baseDate = isValidTimeValue(currentValue)
    ? day(currentValue)
    : day(new Date());

  return setTime(baseDate, {
    hour,
    minute,
    second: 0,
    millisecond: 0,
  }).toISOString();
};

export const FormScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  control,
  startTimeName,
  endTimeName,
  disabled,
}) => {
  const { t } = useTranslation('publish-shift');

  const handleTimeChange = useCallback(
    (
      timeString: string,
      currentValue: FieldPathValue<ShiftFormData, Path<ShiftFormData>>
    ) => {
      const newValue = createTimeFromInput(timeString, currentValue);
      return newValue;
    },
    []
  );

  const renderTimeField = useCallback(
    (path: Path<ShiftFormData>, label: string) => (
      <Controller
        key={path}
        name={path}
        control={control}
        render={({ field }) => {
          const hasValidValue = isValidTimeValue(field.value);
          const displayValue = formatTimeForInput(field.value);

          return (
            <TextField
              label={label}
              type="time"
              value={displayValue}
              helperText={!hasValidValue ? 'No time selected' : undefined}
              onChange={(event) => {
                const newValue = handleTimeChange(
                  event.target.value,
                  field.value
                );
                if (newValue) field.onChange(newValue);
              }}
              onBlur={field.onBlur}
              variant="outlined"
              size="medium"
              fullWidth
              disabled={disabled}
              InputProps={{
                startAdornment: CLOCK_ADORNMENT,
              }}
            />
          );
        }}
      />
    ),
    [control, disabled, handleTimeChange]
  );

  return (
    <div className="flex w-full flex-col space-y-4">
      {renderTimeField(startTimeName, t('starting_time'))}
      {renderTimeField(endTimeName, t('ending_time'))}
    </div>
  );
};
