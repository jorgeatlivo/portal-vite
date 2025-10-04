import { useTranslation } from 'react-i18next';

import { IconCalendarEvent } from '@tabler/icons-react';
import clsx from 'clsx';

import LivoIcon from '@/components/common/LivoIcon';

import { ShiftOnboarding } from '@/types/onboarding';
import { ShiftTimeInDayEnum } from '@/types/shifts';
import { formatTime } from '@/utils/datetime';

import colors from '@/config/color-palette';
import { getDate, SHIFT_TIME_IN_DAY_DEFINITIONS } from '@/utils';
import { Typography } from '../atoms/Typography';

const OnboardingShiftSection = ({
  claimShift,
  className,
  title,
  displayFields = false,
}: {
  claimShift?: ShiftOnboarding;
  className?: string;
  title?: string;
  displayFields?: boolean;
}) => {
  const { t } = useTranslation('calendar');
  const shiftTimeInDayKey = claimShift?.shiftTimeInDay as
    | ShiftTimeInDayEnum
    | undefined;
  const shiftTimeInDay = shiftTimeInDayKey
    ? SHIFT_TIME_IN_DAY_DEFINITIONS[shiftTimeInDayKey]
    : undefined;

  return (
    <div
      className={clsx(
        'flex flex-col gap-1 rounded-lg border border-Divider-Default p-medium',
        className
      )}
    >
      {!!title && (
        <Typography
          variant="body/regular"
          component={'h5'}
          className="!font-semibold"
        >
          {title}
        </Typography>
      )}
      {/* spec */}
      <div className="flex items-center gap-2">
        <IconCalendarEvent size={24} color="#ACBBCB" />
        <Typography variant="body/regular">
          {getDate(claimShift?.startTime || '', 'dddd, D [de] MMMM')}
        </Typography>
      </div>
      {/* shift */}
      <div className="flex items-center gap-2">
        {shiftTimeInDay && (
          <LivoIcon
            name={shiftTimeInDay.icon}
            size={24}
            color={shiftTimeInDay.color}
          />
        )}
        <Typography variant="body/regular">
          {shiftTimeInDay?.name && `${t(shiftTimeInDay.name as never)} `}
          {claimShift?.startTime && `${formatTime(claimShift?.startTime)}h - `}
          {claimShift?.finishTime && `${formatTime(claimShift?.finishTime)}h`}
        </Typography>
      </div>

      {displayFields && claimShift?.specialization && (
        <div
          className={clsx(
            'flex items-center gap-2 opacity-0',
            claimShift?.specialization && 'opacity-100'
          )}
        >
          <LivoIcon
            size={24}
            name="patient-in-bed"
            color={colors['Neutral-400']}
          />
          <Typography variant="body/regular">
            {claimShift?.specialization || '--'}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default OnboardingShiftSection;
