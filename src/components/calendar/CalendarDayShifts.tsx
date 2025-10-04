import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CircularProgress, Typography } from '@mui/material';
import { usePostHog } from 'posthog-js/react';

import { RootState } from '@/store/types';

import { EmptyShiftsState } from '@/components/calendar/EmptyShiftsState';
import LivoIcon from '@/components/common/LivoIcon';
import { HolidayTag } from '@/components/shiftDetails/HolidayTag';
import ShiftCard from '@/components/shifts/ShiftCard';

import { applyFilter } from '@/types/common/shiftFilters';
import {
  ActionComponentIdEnum,
  Shift,
  ShiftTimeInDayEnum,
} from '@/types/shifts';
import { isBeforeToday } from '@/utils/datetime';

import colors from '@/config/color-palette';
import { useShiftContext } from '@/contexts/ShiftContext';
import { formatDate, SHIFT_TIME_IN_DAY_DEFINITIONS } from '@/utils';
import { PastEmptyShiftsState } from './PastShiftsEmptyState';

interface CalendarDayShiftsProps {
  shifts: Shift[];
  date: string;
  loading: boolean;
  reloadData: () => void;
  shadowReload: () => void;
  holiday?: boolean;
}

export const CalendarDayShifts: React.FC<CalendarDayShiftsProps> = ({
  shifts,
  date,
  loading,
  holiday = false,
}): JSX.Element => {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const { selectedShiftId, setSelectedShiftId } = useShiftContext();
  const { t } = useTranslation('calendar');
  const shiftRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filters = useSelector((state: RootState) => state.filterShifts.filters);
  let filteredShifts = shifts;
  filters.forEach((f) => (filteredShifts = applyFilter(f, filteredShifts)));

  // useEffect(() => {
  //   if (selectedShiftId && shiftRefs.current[selectedShiftId]) {
  //     shiftRefs.current[selectedShiftId]?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });
  //   }
  // }, [selectedShiftId]);

  if (loading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const onClickCreateShift = (shiftTimeInDay: string, shift?: Shift) => {
    const params = new URLSearchParams(window.location.search);
    params.set('action', 'create-shift');
    params.set('shift-time', shiftTimeInDay);
    navigate({ search: `?${params.toString()}` }, { state: { shift } });
  };

  const onClickEditShift = (shift?: Shift) => {
    const params = new URLSearchParams(window.location.search);
    params.set('action', 'edit-shift');
    params.set('shift-id', shift?.id.toString() || '');
    navigate({ search: `?${params.toString()}` }, { state: { shift } });
  };

  return (
    <div className="no-scrollbar flex min-w-[280px] flex-1 justify-center overflow-y-auto px-large pt-xLarge">
      <div className="flex max-w-screen-lg flex-1 flex-col">
        <div className="mb-large flex flex-row items-center  space-x-tiny">
          <Typography
            variant="h5"
            className="!font-semibold text-2xl leading-8 text-Text-Default"
          >
            {formatDate(date)}
          </Typography>
          <HolidayTag holiday={holiday} />
        </div>
        <div
          className={
            selectedShiftId
              ? 'flex flex-col space-y-large'
              : 'flex flex-col space-y-large lg:flex-row lg:space-x-large lg:space-y-0'
          }
        >
          {Object.keys(SHIFT_TIME_IN_DAY_DEFINITIONS).map(
            (shiftTimeInDay, index) => {
              const shiftsForTimeInDay = filteredShifts.filter(
                (shift) => shift.shiftTimeInDay === shiftTimeInDay
              );
              const props =
                SHIFT_TIME_IN_DAY_DEFINITIONS[
                  shiftTimeInDay as ShiftTimeInDayEnum
                ];
              return (
                <div key={index} className="mb-large flex-1">
                  <div className="mb-medium flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center space-x-tiny">
                      <LivoIcon
                        name={props.icon}
                        size={24}
                        color={props.color}
                      />
                      <h2 className="subtitle-regular">
                        {t(props.name as never)}
                      </h2>
                    </div>
                    <button
                      type="button"
                      disabled={isBeforeToday(date)}
                      onClick={() => {
                        posthog.capture('new_shift_cta');
                        onClickCreateShift(shiftTimeInDay);
                      }}
                      className={`p-tiny ${isBeforeToday(date) ? 'opacity-0' : ''}`}
                    >
                      <LivoIcon
                        name="plus"
                        size={24}
                        color={colors['Primary-500']}
                      />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-medium">
                    {shiftsForTimeInDay.length === 0 ? (
                      isBeforeToday(date) ? (
                        <PastEmptyShiftsState />
                      ) : (
                        <EmptyShiftsState
                          date={formatDate('DD/MM/YYYY')}
                          shiftTimeInDay={t(props.name as never)}
                          onClick={() => {
                            onClickCreateShift(shiftTimeInDay);
                          }}
                        />
                      )
                    ) : (
                      shiftsForTimeInDay.map((shift, index) => {
                        return (
                          <div
                            key={index}
                            ref={(el: any) => {
                              shiftRefs.current[shift.id] = el;
                            }}
                          >
                            <ShiftCard
                              shift={shift as Shift}
                              onClick={() => {
                                setSelectedShiftId(shift.id);
                              }}
                              isSelected={selectedShiftId === shift.id}
                              actionComponents={[
                                {
                                  id: ActionComponentIdEnum.EDIT,
                                  iconName: 'pencil',
                                  onClick: () => {
                                    onClickEditShift(shift);
                                  },
                                },
                                {
                                  id: ActionComponentIdEnum.COPY,
                                  iconName: 'copy',
                                  onClick: () => {
                                    onClickCreateShift(
                                      shift.shiftTimeInDay,
                                      shift
                                    );
                                  },
                                },
                              ]}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            }
          )}
          <div
            style={{
              height: '24px',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
