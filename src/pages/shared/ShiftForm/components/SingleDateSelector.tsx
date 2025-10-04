import React, { useEffect } from 'react';

import { CalendarMonth } from '@/components/calendar/CalendarMonth';

import { CalendarSummary } from '@/types/publish-shift';
import { day } from '@/utils/datetime';

interface SingleDateSelectorProps {
  setDate: (date: string) => void;
  selectedDate: string;
  calendarSummary: CalendarSummary[];
  getSelectedDayColor?: (day: string) => string | undefined;
}

export const SingleDateSelector: React.FC<SingleDateSelectorProps> = ({
  setDate,
  selectedDate,
  calendarSummary,
  getSelectedDayColor,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<string>(
    day(selectedDate).startOf('month').format('YYYY-MM-DD')
  );
  useEffect(() => {
    const selected = day(selectedDate);
    const _currentMonth = day(currentMonth);

    if (
      selected.month() !== _currentMonth.month() ||
      selected.year() !== _currentMonth.year()
    ) {
      const newMonth = selected.startOf('month').format('YYYY-MM-DD');
      setCurrentMonth(newMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <CalendarMonth
      onDayPress={(day: string) => {
        setDate(day);
      }}
      calendarSummary={calendarSummary.map((day) => ({
        ...day,
        hasAlert: false,
        totalShifts: 0,
      }))}
      monthToRender={currentMonth}
      daysSelected={[selectedDate]}
      getSelectedDayColor={getSelectedDayColor}
      onMonthChange={(month) => {
        setCurrentMonth(month);
      }}
      disablePastDates={true}
    />
  );
};
