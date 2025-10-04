import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { translate } from '@/services/i18next/translate';

import { day, formatRemainingTime, today } from '@/utils/datetime';

import { Typography } from '../atoms/Typography';

interface CountdownProps {
  expirationTime: string | null | undefined;
  className?: string;
}

const isExpired = (expirationTime?: string | null) => {
  if (!expirationTime) return false;
  const now = today();
  const expiration = day(expirationTime);
  return expiration.isBefore(now) || expiration.isSame(now);
};

const Countdown: React.FC<CountdownProps> = ({ expirationTime, className }) => {
  // dummy state used to trigger re-renders each second while countdown is active
  const [_tick, setTick] = useState(0);

  // Update every second while not expired
  useEffect(() => {
    if (!expirationTime) return undefined;

    if (isExpired(expirationTime)) return undefined;

    const id = setInterval(() => {
      // if expired, clear interval and avoid extra ticks
      if (isExpired(expirationTime)) {
        clearInterval(id);
        return;
      }
      setTick((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [expirationTime]);

  let content;

  if (!expirationTime) {
    content = '';
  } else if (isExpired(expirationTime)) {
    content = translate('shift-claim-details:expired');
  } else {
    content = formatRemainingTime(expirationTime);
  }

  if (!expirationTime) return null;

  return (
    <Typography
      variant={'body/regular'}
      className={clsx('inline px-2', className)}
    >
      {content}
    </Typography>
  );
};

export default Countdown;
