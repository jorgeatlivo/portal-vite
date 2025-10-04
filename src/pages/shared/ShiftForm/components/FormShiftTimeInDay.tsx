import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { ShiftTimeConfigDTO } from '@/types/publish-shift';
import { ShiftTimeInDayEnum } from '@/types/shifts';
import { day, setTime, today } from '@/utils/datetime';

import { FormScheduleSelector } from '@/pages/shared/ShiftForm/components/ScheduleSelector';
import { ShiftTimeInDaySelector } from '@/pages/shared/ShiftForm/components/ShiftTimeInDaySelector';
import {
  getTimeForConfig,
  ShiftFormData,
} from '@/pages/shared/ShiftForm/config/shift-form.config';

interface FormShiftTimeInDayProps {
  shiftTimeOptions?: ShiftTimeConfigDTO;
  disabled?: boolean;
}

function FormShiftTimeInDay({
  shiftTimeOptions,
  disabled,
}: FormShiftTimeInDayProps) {
  const { setValue, getValues, watch, control } =
    useFormContext<ShiftFormData>();
  const selectedStartTime = watch('startTime');

  const shiftTimeConfigArray = useMemo(() => {
    if (!shiftTimeOptions) return [];

    return Object.keys(shiftTimeOptions).map((key) => {
      const shiftTimeInDayConfigHashKey = key as keyof typeof shiftTimeOptions;
      const config = shiftTimeOptions[shiftTimeInDayConfigHashKey];

      const start = setTime(today(), {
        hour: config.startTime.hour,
        minute: config.startTime.minute,
      });
      return {
        key: shiftTimeInDayConfigHashKey,
        start,
      };
    });
  }, [shiftTimeOptions]);

  const shiftTimeInDay = useMemo(() => {
    const selected = day(selectedStartTime);

    const match = [...shiftTimeConfigArray].reverse().find(({ start }) => {
      const shiftStart = selected
        .set('hour', start.hour())
        .set('minute', start.minute());

      return !selected.isBefore(shiftStart);
    });

    return (
      match?.key || shiftTimeConfigArray[shiftTimeConfigArray.length - 1]?.key
    );
  }, [selectedStartTime, shiftTimeConfigArray]);

  const changeShiftTimeInDay = useCallback(
    (key: string) => {
      if (!shiftTimeOptions) return;

      const shiftTime = mapHashShiftTimeToEnum(key);

      if (!shiftTime) return;

      const selectedStartTime = getValues('startTime');

      const [newStartTime, newEndTime] = getTimeForConfig(
        shiftTimeOptions,
        shiftTime,
        selectedStartTime
      );

      setValue('startTime', newStartTime);
      setValue('endTime', newEndTime);
    },
    [getValues, setValue, shiftTimeOptions]
  );

  return (
    <>
      <ShiftTimeInDaySelector
        setShiftTimeInDay={(shiftTimeInDay: string) => {
          changeShiftTimeInDay(shiftTimeInDay);
        }}
        shiftTimeInDay={shiftTimeInDay}
        disabled={disabled}
      />
      <FormScheduleSelector
        startTimeName="startTime"
        endTimeName="endTime"
        control={control}
        disabled={disabled}
      />
    </>
  );
}

function mapHashShiftTimeToEnum(hashKey: string) {
  switch (hashKey) {
    case 'dayShift':
      return ShiftTimeInDayEnum.MORNING;
    case 'eveningShift':
      return ShiftTimeInDayEnum.EVENING;
    case 'nightShift':
      return ShiftTimeInDayEnum.NIGHT;

    default:
      return undefined;
  }
}

export default FormShiftTimeInDay;
