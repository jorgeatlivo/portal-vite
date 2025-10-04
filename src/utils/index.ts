import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { getCurrentLocale } from '@/services/i18next/i18next';
import { translate } from '@/services/i18next/translate';

import { ShiftTimeInDayEnum } from '@/types/shifts';
import { day, isoWeekday, today } from '@/utils/datetime';

dayjs.extend(advancedFormat);

export function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isToday(date: string): boolean {
  return day(date).isSame(today(), 'day');
}

function getTomorrowOf(date: Date): Date {
  return day(date).add(1, 'days').toDate();
}

function isTomorrow(date: string): boolean {
  let tomorrow = getTomorrowOf(new Date());
  return day(date).isSame(tomorrow, 'day');
}

export function formatDate(
  date: string,
  shorten?: boolean,
  showYear?: boolean
) {
  let parsedDate = day(date).toDate();

  const options: Intl.DateTimeFormatOptions = {
    weekday: shorten ? 'short' : 'long',
    day: 'numeric',
    month: shorten ? 'short' : 'long',
    year:
      showYear && parsedDate.getFullYear() !== new Date().getFullYear()
        ? 'numeric'
        : undefined,
  };
  const currentLocale = getCurrentLocale();
  let formattedDate = parsedDate.toLocaleDateString(currentLocale, options);
  formattedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDate;
}

export function formatDateWithToday(
  parsedDate: string,
  shorten?: boolean,
  showYear?: boolean
) {
  // compare 2 dates in typescript
  if (isToday(parsedDate)) {
    return translate('calendar:today');
  }

  if (isTomorrow(parsedDate)) {
    return translate('calendar:tomorrow');
  }

  return formatDate(parsedDate, shorten, showYear);
}

export function formatTime(date: string) {
  const timeDate = new Date(date);
  return timeDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
}

export function formatSchedule(startTime: string, finishTime: string) {
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(finishTime);

  return `${formattedStartTime} - ${formattedEndTime}`;
}

export function getMonthName(date: string) {
  const month = day(date).month();
  const { monthNames } = timeConfiguration;
  return `${translate(monthNames[month] as never, {
    ns: 'calendar',
  })} ${day(date).year()}`;
}

export function getDate(date: string, format: string = 'DD/MM/YYYY') {
  return day(date).format(format);
}

export function getWeekDay(date: string) {
  const { dayNames } = timeConfiguration;
  return translate(dayNames[isoWeekday(date)] as never, {
    ns: 'calendar',
  });
}

interface ShiftTimeDefinition {
  id: string;
  name: string;
  color: string;
  icon: string;
  hashKey: string;
}
export const SHIFT_TIME_IN_DAY_DEFINITIONS: {
  [key in ShiftTimeInDayEnum]: ShiftTimeDefinition;
} = {
  [ShiftTimeInDayEnum.MORNING]: {
    id: 'DAY_SHIFT',
    name: 'tomorrow',
    color: '#ff911c',
    icon: 'sunrise',
    hashKey: 'dayShift',
  },
  [ShiftTimeInDayEnum.EVENING]: {
    id: 'EVENING_SHIFT',
    name: 'afternoon',
    color: '#fe69b5',
    icon: 'sunset',
    hashKey: 'eveningShift',
  },
  [ShiftTimeInDayEnum.NIGHT]: {
    id: 'NIGHT_SHIFT',
    name: 'night',
    color: '#138da6',
    icon: 'moon',
    hashKey: 'nightShift',
  },
};

export const timeConfiguration = {
  monthNames: [
    'month_jan',
    'month_feb',
    'month_mar',
    'month_apr',
    'month_may',
    'month_jun',
    'month_jul',
    'month_aug',
    'month_sep',
    'month_oct',
    'month_nov',
    'month_dec',
  ],
  monthNamesShort: [
    'month_short_jan',
    'month_short_feb',
    'month_short_mar',
    'month_short_apr',
    'month_short_may',
    'month_short_jun',
    'month_short_jul',
    'month_short_aug',
    'month_short_sep',
    'month_short_oct',
    'month_short_nov',
    'month_short_dec',
  ],
  dayNames: [
    'day_mon',
    'day_tue',
    'day_wed',
    'day_thu',
    'day_fri',
    'day_sat',
    'day_sun',
  ],
  dayNamesShort: [
    'day_short_mon',
    'day_short_tue',
    'day_short_wed',
    'day_short_thu',
    'day_short_fri',
    'day_short_sat',
    'day_short_sun',
  ],
  today: 'today',
};
