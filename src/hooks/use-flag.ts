import { useMemo } from 'react';

import FlagsService from '@/services/flags.service';

import { FLAGS } from '@/config/flag-enums';

export function useFlag(flag: FLAGS) {
  const value = useMemo(() => {
    return FlagsService.getFlag(flag);
  }, [flag]);

  return value;
}
