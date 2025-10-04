import { useSelector } from 'react-redux';

import { ShiftSummary } from '@/services/shifts-calendar';
import { RootState } from '@/store/types';

import FiltersButton from '@/components/common/FiltersButton';

import { day } from '@/utils/datetime';

import { CalendarMonth } from './CalendarMonth';

interface CalendarSummaryProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onDayPress: (day: string) => void;
  shiftSummary: ShiftSummary[];
  loading: boolean;
  openFilter: () => void;
  selectedDate?: string;
}

export const CalendarSummary: React.FC<CalendarSummaryProps> = ({
  currentMonth,
  onMonthChange,
  onDayPress,
  shiftSummary,
  loading,
  openFilter,
  selectedDate,
}) => {
  const filters = useSelector((state: RootState) => state.filterShifts.filters);
  const { selectedProfessionals } = useSelector(
    (state: RootState) => state.filterShifts
  );
  const numberOfAppliedFilters =
    filters.filter((f) => f.appliedOptions.length > 0).length +
    (selectedProfessionals.length > 0 ? 1 : 0);
  return (
    <div className="flex w-screen flex-col items-center justify-center space-y-small self-start border-b border-solid border-Divider-Subtle bg-white px-medium pb-2 md:h-full md:w-[256px] md:justify-start md:border-r md:pb-4 md:pt-[20px]">
      <div>
        <CalendarMonth
          onDayPress={(_day: string) => {
            onDayPress(_day);
            if (day(_day).month() !== day(currentMonth).month()) {
              onMonthChange(day(_day).startOf('month').format('YYYY-MM-DD'));
            }
          }}
          calendarSummary={shiftSummary}
          monthToRender={currentMonth}
          daysSelected={selectedDate ? [selectedDate.toString()] : []}
          onMonthChange={(month: string) => {
            onMonthChange(month);
          }}
        />
        {filters && filters.length > 0 && (
          <FiltersButton
            onClick={openFilter}
            filters={filters}
            numberOfAppliedFilters={numberOfAppliedFilters}
          />
        )}
      </div>
    </div>
  );
};
