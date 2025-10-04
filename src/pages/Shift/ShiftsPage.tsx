import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';
import { ShiftListComponent } from '@/components/shiftlist/ShiftListComponent';

import { today } from '@/utils/datetime';

import { ShiftProvider, useShiftContext } from '@/contexts/ShiftContext';
import useFetchPaginatedShiftList from '@/pages/Shift/hooks/useFetchPaginatedShiftList';
import { ShiftDetailsSection } from '@/pages/Shift/views/ShiftDetailsSection';
import ShiftCreationPage from '@/pages/shared/ShiftForm/ShiftCreationPage';
import ShiftModificationPage from '../shared/ShiftForm/ShiftModificationPage';

const ShiftListPageContent: React.FC = () => {
  const { tab } = useShiftContext();
  const { selectedProfessionals, filters } = useSelector(
    (state: RootState) => state.filterShifts
  );
  const [sortBy, setSortBy] = useState<SortingOptionsEnum>(
    SortingOptionsEnum.SHIFT_TIME
  );
  const pageSize = 30;

  const {
    isLoading,
    listResponse: dayShifts,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalShifts,
  } = useFetchPaginatedShiftList(
    tab,
    sortBy,
    today().format('YYYY-MM-DD'),
    selectedProfessionals,
    filters,
    pageSize
  );

  const { accountInfo } = useSelector((state: RootState) => state.account);

  const reload = useCallback(() => {
    refetch({
      cancelRefetch: false,
    });
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="relative flex size-full justify-between overflow-hidden md:space-x-medium md:overflow-x-scroll">
      <ShiftListComponent
        dayShifts={dayShifts}
        loading={isLoading}
        reloadData={reload}
        shadowReload={reload}
        selectedSortingOption={sortBy}
        sortingOptions={
          accountInfo?.facility.portalShiftsOrderingByEnabled
            ? [
                SortingOptionsEnum.SHIFT_TIME,
                SortingOptionsEnum.SHIFT_PUBLICATION_TIME,
              ]
            : []
        }
        setSelectedSortingOption={(option) =>
          setSortBy(option as SortingOptionsEnum)
        }
        isNextPageLoading={isFetchingNextPage}
        hasNextPage={hasNextPage || false}
        onLoadMore={handleLoadMore}
        totalShifts={totalShifts}
      />
      <ShiftDetailsSection reloadShifts={reload} />
      <ShiftCreationPage reloadShifts={reload} />
      <ShiftModificationPage reloadShifts={reload} />
    </div>
  );
};

const ShiftsPage: React.FC = () => {
  return (
    <ShiftProvider>
      <ShiftListPageContent />
    </ShiftProvider>
  );
};

export default ShiftsPage;
