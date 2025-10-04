import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { formatTime } from '@/utils';

interface ScheduleComponentProps {
  startTime: string;
  finishTime: string;
  className?: string;
}

export const ScheduleComponent: React.FC<ScheduleComponentProps> = ({
  startTime,
  finishTime,
  className,
}) => {
  return (
    <div className={'flex items-center flex-row justify-start ' + className}>
      <p>{formatTime(startTime)}</p>
      <LivoIcon size={24} name="arrow-right" color={colors['Grey-300']} />
      <p>{formatTime(finishTime)}</p>
    </div>
  );
};
