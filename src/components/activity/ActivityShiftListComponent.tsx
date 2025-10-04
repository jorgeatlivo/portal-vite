import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';

import { MainPageHeader } from '@/components/common/MainPageHeader';
import ShiftCard from '@/components/shifts/ShiftCard';

import { Shift } from '@/types/shifts';

import { useShiftContext } from '@/contexts/ShiftContext';
import { EmptyDetailsComponent } from './EmptyDetailsComponent';

interface ActivityShiftListProps {
  loading: boolean;
  shifts: Shift[];
}
export const ActivityShiftListComponent: React.FC<ActivityShiftListProps> = ({
  loading,
  shifts,
}) => {
  const { t } = useTranslation('calendar');
  const { selectedShiftId, setSelectedShiftId } = useShiftContext();

  const shiftRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (selectedShiftId && shiftRefs.current[selectedShiftId]) {
      shiftRefs.current[selectedShiftId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedShiftId]);

  return (
    <div className="no-scrollbar flex flex-1 justify-center overflow-y-auto pt-xLarge">
      <div className="mx-4 flex size-full max-w-screen-lg flex-col">
        <MainPageHeader title={t('activity_title')} />
        <div className="flex size-full flex-col space-y-small">
          {loading ? (
            <div className="flex h-full flex-1 items-center justify-center">
              <CircularProgress />
            </div>
          ) : shifts.length === 0 ? (
            <div className="flex h-full flex-col ">
              <EmptyDetailsComponent />
            </div>
          ) : (
            <div
              className={
                'no-scrollbar flex flex-col gap-1 space-y-small pb-xLarge'
              }
            >
              {shifts.map((shift, index) => {
                return (
                  <div
                    key={index}
                    ref={(el: any) => {
                      shiftRefs.current[shift.id] = el;
                    }}
                  >
                    <ShiftCard
                      showShiftTime
                      showCapacity={false}
                      showSkillTags={false}
                      shift={shift as Shift}
                      onClick={() => {
                        setSelectedShiftId(shift.id);
                      }}
                      isSelected={selectedShiftId === shift.id}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
