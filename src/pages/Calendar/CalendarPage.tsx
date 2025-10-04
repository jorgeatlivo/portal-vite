import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import { CalendarDayShifts } from '@/components/calendar/CalendarDayShifts';
import { CalendarSummary } from '@/components/calendar/CalendarSummary';
import FilterShiftsModal from '@/components/shiftlist/FilterShiftsModal';

import { useSearchParam, useSearchParams } from '@/hooks/use-search-params';
import { day, today } from '@/utils/datetime';

import { ShiftProvider } from '@/contexts/ShiftContext';
import useFetchCalendarShifts from '@/pages/Calendar/hooks/useFetchCalendarShifts';
import useFetchShiftsSummary from '@/pages/Calendar/hooks/useFetchShiftsSummary';
import { ShiftDetailsSection } from '@/pages/Shift/views/ShiftDetailsSection';
import ShiftCreationPage from '@/pages/shared/ShiftForm/ShiftCreationPage';
import ShiftModificationPage from '../shared/ShiftForm/ShiftModificationPage';

const CalendarPageContent: React.FC = () => {
  const selectedDate = useSearchParam('date');
  const { setParam } = useSearchParams();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const { filters, selectedProfessionals } = useSelector(
    (state: RootState) => state.filterShifts
  );
  const [currentMonth, setCurrentMonth] = useState(() =>
    day(selectedDate || undefined)
      .startOf('month')
      .format('YYYY-MM-DD')
  );

  const {
    isLoading: loadingShifts,
    shifts,
    holiday,
    refetch: refetchShifts,
  } = useFetchCalendarShifts(selectedDate, selectedProfessionals);

  const firstDayOfMonth = useMemo(() => {
    if (!currentMonth || currentMonth === 'Invalid date') {
      return today().startOf('month').format('YYYY-MM-DD');
    }

    return day(currentMonth).startOf('month').format('YYYY-MM-DD');
  }, [currentMonth]);

  const lastDayOfMonth = useMemo(() => {
    if (!currentMonth || currentMonth === 'Invalid date') {
      return today().endOf('month').format('YYYY-MM-DD');
    }

    return day(currentMonth).endOf('month').format('YYYY-MM-DD');
  }, [currentMonth]);

  const {
    isLoading: loadingShiftSummary,
    shiftSummary,
    refetch: refetchShiftsSummary,
  } = useFetchShiftsSummary(firstDayOfMonth, lastDayOfMonth, filters);

  const reloadData = useCallback(() => {
    refetchShifts();
    refetchShiftsSummary();
  }, [refetchShifts, refetchShiftsSummary]);

  const onDayPress = useCallback(
    (day: string) => {
      setParam('date', day);
    },
    [setParam]
  );

  useEffect(() => {
    if (!selectedDate) {
      setParam('date', today().format('YYYY-MM-DD'));
      setCurrentMonth(today().startOf('month').format('YYYY-MM-DD'));
    }
  }, [selectedDate, setParam]);

  return (
    <div className="relative flex size-full justify-between overflow-hidden">
      <div className="flex h-full flex-1 flex-col justify-between overflow-x-hidden overflow-y-scroll md:flex-row md:overflow-hidden">
        <CalendarSummary
          selectedDate={selectedDate}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayPress={onDayPress}
          shiftSummary={shiftSummary}
          loading={loadingShiftSummary}
          openFilter={() => setFilterModalOpen(true)}
        />
        <div className="flex w-full flex-1 overflow-x-scroll md:overflow-hidden">
          <CalendarDayShifts
            shifts={shifts}
            date={selectedDate.toString()}
            loading={loadingShifts}
            reloadData={reloadData}
            shadowReload={reloadData}
            holiday={holiday}
          />
          <ShiftDetailsSection reloadShifts={reloadData} extraColumn />
        </div>
      </div>

      <ShiftCreationPage reloadShifts={reloadData} />
      <FilterShiftsModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      />
      <ShiftModificationPage reloadShifts={reloadData} />
    </div>
  );
};

export const Calendar = () => {
  return (
    <ShiftProvider>
      <CalendarPageContent />
    </ShiftProvider>
  );
};
