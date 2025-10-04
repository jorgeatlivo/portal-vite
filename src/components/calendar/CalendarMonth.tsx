import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ShiftSummary } from '@/services/shifts-calendar';

import LivoIcon from '@/components/common/LivoIcon';

import {
  day,
  firstDayOfWeek,
  getDayInMonth,
  isBeforeToday,
  lastDayOfMonth,
  today,
} from '@/utils/datetime';

import colors from '@/config/color-palette';
import { getMonthName, timeConfiguration } from '@/utils';
import { CalendarDayItem } from './CalendarDayItem';

const getDaysInMonth = (date: string) => {
  const lastDay = lastDayOfMonth(date);
  return Array.from({ length: lastDay }, (_, i) => i + 1);
};

interface CalendarMonthProps {
  onDayPress: (day: string) => void;
  calendarSummary: ShiftSummary[];
  monthToRender: string;
  daysSelected: string[];
  onMonthChange: (month: string) => void;
  getSelectedDayColor?: (day: string) => string | undefined;
  disablePastDates?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = ({
  onDayPress,
  calendarSummary,
  monthToRender,
  daysSelected,
  onMonthChange,
  disablePastDates,
  getSelectedDayColor,
}) => {
  const { t } = useTranslation('calendar');
  const daysInMonth = getDaysInMonth(monthToRender);
  const _firstDayOfWeek = (firstDayOfWeek(monthToRender) + 6) % 7;

  let days: ReactNode[] = [];

  for (let i = -_firstDayOfWeek; i < 0; i++) {
    const currentDay = getDayInMonth(monthToRender, i);

    days.push(
      <CalendarDayItem
        key={`empty-initial-${i}`}
        day={currentDay.date().toString()}
        isToday={false}
        onPress={() => onDayPress(currentDay.format('YYYY-MM-DD'))}
        isOtherMonth={true}
        isSelected={false}
        hasAlert={
          calendarSummary.find(
            (calendarSummaryDay) =>
              currentDay.format('YYYY-MM-DD') === calendarSummaryDay.date
          )?.hasAlert || false
        }
        hasShifts={false}
        disabled={disablePastDates && isBeforeToday(currentDay)}
      />
    );
  }

  days = days.concat(
    daysInMonth.map((_day, index) => {
      const renderedDay = day(monthToRender)
        .startOf('month')
        .add(_day - 1, 'day');
      const renderedDayString = renderedDay.format('YYYY-MM-DD');
      const todayData = calendarSummary.find(
        (calendarSummaryDay) => renderedDayString === calendarSummaryDay.date
      );
      const selectedDayColor = getSelectedDayColor?.(renderedDayString);

      return (
        <CalendarDayItem
          key={index}
          day={_day.toString()}
          isToday={renderedDay.isSame(today(), 'day')}
          onPress={() => onDayPress(renderedDayString)}
          hasAlert={todayData?.hasAlert || false}
          isSelected={daysSelected.some((daySelected) =>
            renderedDay.isSame(daySelected, 'day')
          )}
          selectedColor={selectedDayColor}
          isOtherMonth={false}
          hasShifts={(todayData && todayData.totalShifts > 0) || false}
          holiday={todayData?.holiday}
          disabled={disablePastDates && isBeforeToday(renderedDay)}
        />
      );
    })
  );

  let offset = 0;
  while (days.length < 42) {
    const currentDay = day(monthToRender)
      .add(1, 'month')
      .startOf('month')
      .add(offset, 'day');

    const currentDayString = currentDay.format('YYYY-MM-DD');
    const todayData = calendarSummary.find(
      (calendarSummaryDay) => currentDayString === calendarSummaryDay.date
    );

    days.push(
      <CalendarDayItem
        key={`empty-final-${days.length}`}
        day={currentDay.date().toString()}
        isToday={false}
        onPress={() => onDayPress(currentDayString)}
        isOtherMonth={true}
        isSelected={false}
        hasAlert={todayData?.hasAlert || false}
        hasShifts={false}
        disabled={disablePastDates && currentDay.isBefore(today(), 'day')}
      />
    );
    offset++;
  }

  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
    days.slice(i * 7, i * 7 + 7)
  );

  const renderedWeeks = weeks.map((week, index) => (
    <div key={`week-${index}`} className={`flex flex-row space-x-small`}>
      {week}
    </div>
  ));

  return (
    <div className="flex flex-col items-center self-start p-small">
      <div className="mb-small flex w-full flex-row items-center justify-center space-x-tiny">
        <h1 className="heading-sm">{getMonthName(monthToRender)}</h1>
        <div className="flex flex-row space-x-tiny">
          <button
            type="button"
            className="p-tiny"
            onClick={() => {
              const previousMonth = day(monthToRender)
                .subtract(1, 'month')
                .format('YYYY-MM-DD');
              onMonthChange(previousMonth);
            }}
          >
            <LivoIcon
              size={24}
              name="chevron-left"
              color={colors['Primary-500']}
            />
          </button>
          <button
            type="button"
            className="p-tiny"
            onClick={() => {
              const nextMonth = day(monthToRender)
                .add(1, 'month')
                .format('YYYY-MM-DD');
              onMonthChange(nextMonth);
            }}
          >
            <LivoIcon
              size={24}
              name="chevron-right"
              color={colors['Primary-500']}
            />
          </button>
        </div>
      </div>

      <div className="mb-small flex flex-row items-start justify-start space-x-small">
        {timeConfiguration.dayNamesShort.map((day, index) => (
          <p
            key={index}
            className="info-overline w-xLarge text-center text-Text-Subtle"
          >
            {t(day as never)}
          </p>
        ))}
      </div>
      <div className="flex flex-col items-start justify-start space-y-tiny">
        {renderedWeeks}
      </div>
    </div>
  );
};
