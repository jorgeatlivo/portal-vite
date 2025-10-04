import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CircularProgress } from '@mui/material';
import { usePostHog } from 'posthog-js/react';

import { RootState } from '@/store/types';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';

import { applyFilter } from '@/types/common/shiftFilters';
import { ActionComponentIdEnum, DayShift, Shift } from '@/types/shifts';

import { useShiftContext } from '@/contexts/ShiftContext';
import { MainPageHeader } from '../common/MainPageHeader';
import { EmptyShiftsState } from './EmptyShiftsState';
import { FilteredShiftsEmptyState } from './FilteredShiftsEmptyState';
import FilterShiftsModal from './FilterShiftsModal';
import { FiltersRow } from './FiltersRow';
import { VirtualizedShiftList } from './VirtualizedShiftList';

interface ShiftListComponentProps {
  dayShifts: DayShift[];
  loading: boolean;
  reloadData: () => void;
  shadowReload: () => void;
  selectedSortingOption: SortingOptionsEnum;
  sortingOptions: SortingOptionsEnum[];
  setSelectedSortingOption: (option: SortingOptionsEnum) => void;
  isNextPageLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  totalShifts: number;
}

export const ShiftListComponent: React.FC<ShiftListComponentProps> = ({
  dayShifts,
  loading,
  selectedSortingOption,
  sortingOptions,
  setSelectedSortingOption,
  isNextPageLoading,
  hasNextPage,
  onLoadMore,
  totalShifts,
}) => {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const { t } = useTranslation(['publish-shift', 'calendar']);
  const { tab, setTab, selectedShiftId } = useShiftContext();
  const [isShiftNotFilled, setIsShiftNotFilled] = useState(false);
  const scrollableDivRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const onClickCreateShift = useCallback(
    (shift?: Shift) => {
      scrollToTop();
      const params = new URLSearchParams(window.location.search);
      params.set('action', 'create-shift');
      navigate({ search: `?${params.toString()}` }, { state: { shift } });
    },
    [navigate]
  );

  const onClickEditShift = useCallback(
    (shift?: Shift) => {
      scrollToTop();
      const params = new URLSearchParams(window.location.search);
      params.set('action', 'edit-shift');
      params.set('shift-id', shift?.id.toString() || '');
      navigate({ search: `?${params.toString()}` }, { state: { shift } });
    },
    [navigate]
  );

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const filters = useSelector((state: RootState) => state.filterShifts.filters);

  const filteredDayShifts = useMemo(() => {
    const categoryFilter = filters.find((f) => f.key === 'category');

    if (!categoryFilter || categoryFilter.appliedOptions.length === 0) {
      return dayShifts;
    }

    const dayShiftArray = [] as DayShift[];
    dayShifts.forEach((dayShift) => {
      let filteredShifts = dayShift.shifts;
      filteredShifts = applyFilter(categoryFilter, filteredShifts);

      if (filteredShifts.length > 0) {
        dayShiftArray.push({
          ...dayShift,
          shifts: filteredShifts,
        });
      }
    });
    return dayShiftArray;
  }, [dayShifts, filters]);

  useEffect(() => {
    if (selectedShiftId) {
      const selectedShift = filteredDayShifts
        .flatMap((day) => day.shifts)
        .find((shift) => shift.id === selectedShiftId);
      if (
        selectedShift &&
        selectedShift.totalAcceptedClaims < selectedShift.capacity
      ) {
        setIsShiftNotFilled(
          selectedShift.totalAcceptedClaims < selectedShift.capacity
        );
      } else {
        setIsShiftNotFilled(false);
      }
    } else {
      setIsShiftNotFilled(false);
    }
  }, [selectedShiftId, filteredDayShifts]);

  const onClickPublishButton = useCallback(() => {
    posthog.capture('new_shift_cta');
    onClickCreateShift();
  }, [onClickCreateShift, posthog]);

  return (
    <div className="flex w-full flex-1 justify-start pt-xLarge md:justify-center md:overflow-hidden md:overflow-x-scroll">
      <div className="flex size-full max-w-screen-lg flex-col justify-start px-xLarge md:min-w-[400px]">
        <MainPageHeader
          title={t('calendar:shift_list_title')}
          counter={totalShifts}
          buttonLabel={t('publish_shift_button')}
          action={onClickPublishButton}
          icon={'plus'}
        />
        <div className="flex w-full flex-wrap items-center space-x-tiny space-y-tiny">
          <FiltersRow
            appliedFilter={tab}
            setFilter={(filter: string) => {
              setTab(filter);
            }}
            onFiltersButtonClick={() => setFilterModalOpen(true)}
            selectedSortingOption={selectedSortingOption}
            sortingOptions={sortingOptions}
            setSelectedSortingOption={setSelectedSortingOption}
          />
        </div>
        {/* shift list */}
        <div className="flex w-full flex-1 justify-center">
          {loading ? (
            <div className="flex h-full flex-1 items-center justify-center">
              <CircularProgress />
            </div>
          ) : filteredDayShifts.length === 0 ? (
            tab === 'all' ? (
              <EmptyShiftsState
                onClick={() => {
                  onClickCreateShift();
                }}
              />
            ) : (
              <FilteredShiftsEmptyState
                onClick={() => {
                  setTab('all');
                }}
              />
            )
          ) : (
            <div className="relative m-0 flex flex-1 flex-col">
              <VirtualizedShiftList
                hasSelectedShiftClaims={isShiftNotFilled}
                dayShifts={filteredDayShifts}
                actionComponents={[
                  {
                    id: ActionComponentIdEnum.EDIT,
                    iconName: 'pencil',
                    onClick: (shift: Shift) => {
                      onClickEditShift(shift);
                    },
                  },
                  {
                    id: ActionComponentIdEnum.COPY,
                    iconName: 'copy',
                    onClick: (shift: Shift) => {
                      onClickCreateShift(shift);
                    },
                  },
                ]}
                sortedBy={
                  sortingOptions.length > 0 ? selectedSortingOption : undefined
                }
                isNextPageLoading={isNextPageLoading}
                hasNextPage={hasNextPage}
                onLoadMore={() => Promise.resolve(onLoadMore())}
                scrollDisabled={filterModalOpen}
              />
            </div>
          )}
        </div>
      </div>
      <FilterShiftsModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
      />
    </div>
  );
};
