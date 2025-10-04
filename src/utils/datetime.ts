/**
 * datetime utilities functions using dayjs
 */

import dayjs, { Dayjs, UnitType } from 'dayjs';

import { Logger } from '@/services/logger.service';

import { DATETIME_FORMAT } from '@/config/datetime-format.enum';

export async function changeDatetimeLocale(locale: string) {
  try {
    await import(/* @vite-ignore */ `dayjs/locale/${locale}.js`);
    dayjs.locale(locale);
  } catch (error) {
    console.warn(`Locale ${locale} not found, falling back to default`);
  }
}
export function formatDateTime(
  utcTime: string,
  format: string = DATETIME_FORMAT.DATE_TIME
) {
  return dayjs(utcTime).format(format);
}

export function formatTime(utcTime: string) {
  return formatDateTime(utcTime, DATETIME_FORMAT.TIME);
}

export function formatDate(
  utcTime: string,
  format: string = DATETIME_FORMAT.DATE
) {
  return formatDateTime(utcTime, format);
}

export function isBeforeToday(date: string | Dayjs) {
  return dayjs(date).isBefore(dayjs(), 'day');
}

export function isToday(date: string) {
  return dayjs(date).isSame(dayjs(), 'day');
}

export function isTomorrow(date: string) {
  let tomorrow = dayjs().add(1, 'day');
  return dayjs(date).isSame(tomorrow, 'day');
}

export function isSameDay(date1: string, date2: string) {
  return dayjs(date1).isSame(dayjs(date2), 'day');
}

export function getTomorrowOf(date: Date) {
  return dayjs(date).add(1, 'days').toDate();
}

export function formatDateWithToday(parsedDate: string) {
  if (isToday(parsedDate)) {
    return 'Hoy';
  }

  if (isTomorrow(parsedDate)) {
    return 'Mañana';
  }

  return formatDate(parsedDate);
}

export function formatSchedule(startTime: string, finishTime: string) {
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(finishTime);

  return `${formattedStartTime} - ${formattedEndTime}`;
}

export function getDayOfWeek(date: string) {
  return dayjs(date).format('dddd');
}

export function getMonth(date: string) {
  return dayjs(date).format('MMMM');
}

export function getYear(date: string) {
  return dayjs(date).format('YYYY');
}

export function getDay(date: string) {
  return dayjs(date).format('DD');
}

export function firstDayOfWeek(date: string) {
  return dayjs(date).startOf('month').day();
}

export function lastDayOfMonth(date: string) {
  return dayjs(date).endOf('month').date();
}

export function getDayInMonth(month: string, dayInMonth: number) {
  return dayjs(month).startOf('month').add(dayInMonth, 'day');
}

export function today() {
  return dayjs();
}

export function day(date: string | Dayjs | undefined | Date) {
  return dayjs(date);
}

export function duration(
  endtime: string | Dayjs,
  startTime: string | Dayjs,
  by: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'
) {
  return day(endtime).diff(day(startTime), by);
}

export function setTime(
  day: string | Dayjs | undefined,
  config: Partial<Record<UnitType, number>>
) {
  let _day = dayjs(day);
  for (const key in config) {
    const value = config[key as UnitType];
    if (typeof value !== 'number') continue;
    _day = _day.set(key as UnitType, value);
  }

  return _day;
}

export function isSameOrAfter(
  date: string | Dayjs,
  dateToCompare: string | Dayjs
) {
  const _date = dayjs(date);
  const _dateToCompare = dayjs(dateToCompare);
  return (
    _date.isSame(_dateToCompare, 'day') || _date.isAfter(_dateToCompare, 'day')
  );
}

export function isoWeekday(day: string | Dayjs) {
  const _day = dayjs(day);
  const d = _day.day();
  return (d + 6) % 7; // dayjs returns 0 for sunday, so we need to add 6 to get the correct iso weekday
}

/**
 * Format time as HH:mm from date string
 */
export function formatTimeOnly(date: string) {
  const dayjsDate = dayjs(date);
  return dayjsDate.isValid() ? dayjsDate.format('HH:mm') : '';
}

/**
 * Check if date string is valid
 */
export function isValidDate(date: string) {
  return dayjs(date).isValid();
}

/**
 * Update time in a date string and return ISO string
 */
export function updateDateTimeToISO(day: string, time: string) {
  // Validate inputs
  if (!day || !time) {
    return new Date().toISOString(); // Return current time as fallback
  }

  const timeMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!timeMatch) {
    return new Date().toISOString(); // Return current time as fallback
  }

  const [, hour, minute] = timeMatch;
  const hourNum = parseInt(hour, 10);
  const minuteNum = parseInt(minute, 10);

  // Validate hour and minute ranges
  if (hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) {
    return new Date().toISOString(); // Return current time as fallback
  }

  const dayObj = dayjs(day);
  if (!dayObj.isValid()) {
    return new Date().toISOString(); // Return current time as fallback
  }

  const newTime = setTime(day, {
    hour: hourNum,
    minute: minuteNum,
  });

  return newTime.toISOString();
}

/**
 * Validate time format (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!TIME_REGEX.test(time)) return false;
  return dayjs(time, 'HH:mm', true).isValid();
}

/**
 * Format remaining time until expiration in "Xh XXm XXs" format
 */
export function formatRemainingTime(expirationTime: string | null): string {
  if (!expirationTime) return '0h 0m 0s';

  const now = today();
  const expiration = day(expirationTime);

  // If expiration time has passed, return "0h 0m 0s"
  if (expiration.isBefore(now) || expiration.isSame(now)) {
    return '0h 0m 0s';
  }

  const diffInMs = expiration.diff(now);
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds
    .toString()
    .padStart(2, '0')}s`;
}
