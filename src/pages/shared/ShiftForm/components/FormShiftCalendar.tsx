import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Box } from '@mui/material';

import { CalendarSummary } from '@/types/publish-shift';
import { day, setTime } from '@/utils/datetime';

import { DateSelector } from '@/pages/shared/ShiftForm/components/DateSelector';
import { RecurrentToggler } from '@/pages/shared/ShiftForm/components/RecurrentToggler';
import { SingleDateSelector } from '@/pages/shared/ShiftForm/components/SingleDateSelector';
import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';

interface FormShiftCalendarProps {
  bulkSelectionEnabled?: boolean;
  onChange?: (dates: string[]) => void;
  title?: string;
  calendarSummary?: CalendarSummary[];
  getSelectedDayColor?: (day: string) => string | undefined;
  disabled?: boolean;
}

function FormShiftCalendar(props: FormShiftCalendarProps) {
  const {
    disabled,
    bulkSelectionEnabled,
    title,
    calendarSummary,
    getSelectedDayColor,
  } = props;

  const { control, setValue, getValues } = useFormContext<ShiftFormData>();
  const [isRecurrent, setIsRecurrent] = React.useState(false);

  const changeDates = useCallback(
    (datesSelected: string[]) => {
      setValue('dates', datesSelected);

      // Get the earliest date and recalculate from there
      const firstDay = datesSelected.sort((a, b) => day(a).diff(day(b)))[0];

      const selectedStartTime = getValues('startTime');
      const selectedEndTime = getValues('endTime');

      // Update start and end times based on the earlier selected date
      const newStartTime = setTime(firstDay, {
        hour: day(selectedStartTime).hour(),
        minute: day(selectedStartTime).minute(),
      }).toISOString();
      let newEndTime = setTime(firstDay, {
        hour: day(selectedEndTime).hour(),
        minute: day(selectedEndTime).minute(),
      }).toISOString();

      if (day(newStartTime).isAfter(day(newEndTime))) {
        newEndTime = day(newEndTime).add(1, 'day').toISOString();
      }

      setValue('startTime', newStartTime);
      setValue('endTime', newEndTime);
    },
    [getValues, setValue]
  );

  return (
    <Controller
      name={'dates'}
      control={control}
      render={({ field: { value = [] } }) => (
        <div className="w-full">
          <div
            className="flex w-full flex-col items-center gap-4 rounded-lg"
            style={{
              opacity: disabled ? 0.5 : 1,
              pointerEvents: disabled ? 'none' : 'auto',
            }}
          >
            {bulkSelectionEnabled && (
              <RecurrentToggler
                disabled={disabled}
                isRecurrent={isRecurrent}
                setIsRecurrent={() => {
                  if (isRecurrent) changeDates([value[0]]);
                  setIsRecurrent(!isRecurrent);
                }}
              />
            )}
            <Box className="w-full self-center rounded-lg border border-solid border-Divider-Default p-4">
              {isRecurrent && bulkSelectionEnabled ? (
                <DateSelector
                  selectedDates={value}
                  getSelectedDayColor={getSelectedDayColor}
                  calendarSummary={calendarSummary ?? []}
                  setDates={(values) => {
                    changeDates(values);
                  }}
                />
              ) : (
                <SingleDateSelector
                  selectedDate={value[0]}
                  getSelectedDayColor={getSelectedDayColor}
                  calendarSummary={calendarSummary ?? []}
                  setDate={(date: string) => {
                    changeDates([date]);
                  }}
                />
              )}
            </Box>
          </div>
          {!!title && <p className="body-regular text-Text-Subtle">{title}</p>}
        </div>
      )}
    />
  );
}

export default FormShiftCalendar;
