import React, { useEffect } from 'react';

import { CalendarMonth } from '@/components/calendar/CalendarMonth';

import { CalendarSummary } from '@/types/publish-shift';
import { day, today } from '@/utils/datetime';

interface DateSelectorProps {
  setDates: (dates: string[]) => void;
  selectedDates: string[];
  calendarSummary: CalendarSummary[];
  getSelectedDayColor?: (day: string) => string | undefined;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  setDates,
  selectedDates,
  calendarSummary,
  getSelectedDayColor,
}) => {
  const lastSelectedDate =
    selectedDates.length > 0
      ? selectedDates[selectedDates.length - 1]
      : today().format('YYYY-MM-DD');
  const selectedMonth = day(lastSelectedDate)
    .startOf('month')
    .format('YYYY-MM-DD');
  const [currentMonth, setCurrentMonth] = React.useState<string>(selectedMonth);
  useEffect(() => {
    if (day(lastSelectedDate).month() !== day(currentMonth).month()) {
      // change month on when the selected date is on another month
      const newSelectedMonth = day(selectedMonth)
        .startOf('month')
        .format('YYYY-MM-DD');
      setCurrentMonth(newSelectedMonth);
    }
  }, [lastSelectedDate]);

  return (
    <CalendarMonth
      onDayPress={(day: string) => {
        if (selectedDates.includes(day)) {
          if (selectedDates.length > 1) {
            setDates(selectedDates.filter((date) => date !== day));
          }
        } else {
          setDates([...selectedDates, day]);
        }
      }}
      calendarSummary={calendarSummary.map((day) => ({
        ...day,
        hasAlert: false,
        totalShifts: 0,
      }))}
      disablePastDates={true}
      getSelectedDayColor={getSelectedDayColor}
      monthToRender={currentMonth}
      daysSelected={selectedDates}
      onMonthChange={(month) => {
        setCurrentMonth(month);
      }}
    />
  );
};
