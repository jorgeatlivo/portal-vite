import React, { useEffect, useMemo, useRef } from 'react';
import { VariableSizeList } from 'react-window';
import InfiniteLoaderDefault from 'react-window-infinite-loader';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';
import ShiftCard from '@/components/shifts/ShiftCard';

import { useWindowSize } from '@/hooks/use-window-size';
import { ActionComponentIdEnum, DayShift, Shift } from '@/types/shifts';

import { useShiftContext } from '@/contexts/ShiftContext';
import { formatDateWithToday } from '@/utils';
import LoadingView from '../common/LoadingView';

export interface VirtualizedShiftListProps {
  dayShifts: DayShift[];
  actionComponents: Array<{
    iconName: string;
    onClick: (shift: Shift) => void;
    id: ActionComponentIdEnum;
  }>;
  sortedBy?: SortingOptionsEnum;
  hasSelectedShiftClaims: boolean;
  isNextPageLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => Promise<void>;
  scrollDisabled?: boolean;
}

type ListItem =
  | { type: 'title'; date: string }
  | { type: 'shift'; shift: Shift };

type RowData = {
  items: ListItem[];
  onSelect: (id: number) => void;
  selectedId: number | undefined;
  actionComponents: VirtualizedShiftListProps['actionComponents'];
  sortedBy?: SortingOptionsEnum;
};

const isBannerOpen = localStorage.getItem('display_offer_banner') === 'true';
const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: 0,
  DATE_HEADER_HEIGHT: 45,
  SHIFT_HEIGHT: 72,
  BOTTOM_MARGIN: isBannerOpen ? 210 : 140,
  LARGE_BOTTOM_MARGIN: isBannerOpen ? 280 : 180,
  SCROLL_DURATION: 650,
  OVERSCAN_COUNT: 2,
  LOAD_MORE_THRESHOLD: 5,
  LARGE_SCREEN_BREAKPOINT: 1700,
  SMALL_SCREEN_BREAKPOINT: 900,
  LARGE_SCREEN_SHIFT_HEIGHT: 80,
  SMALL_SCREEN_SHIFT_HEIGHT: 165,
} as const;

const calculateShiftCardHeight = (
  hasSelectedShiftClaims: boolean,
  screenWidth: number
): number => {
  if (hasSelectedShiftClaims) {
    return screenWidth > LAYOUT_CONSTANTS.LARGE_SCREEN_BREAKPOINT
      ? LAYOUT_CONSTANTS.LARGE_SCREEN_SHIFT_HEIGHT
      : LAYOUT_CONSTANTS.SMALL_SCREEN_SHIFT_HEIGHT;
  }
  return screenWidth > LAYOUT_CONSTANTS.SMALL_SCREEN_BREAKPOINT
    ? LAYOUT_CONSTANTS.LARGE_SCREEN_SHIFT_HEIGHT
    : LAYOUT_CONSTANTS.SMALL_SCREEN_SHIFT_HEIGHT;
};

const calculateContainerHeight = (
  windowHeight: number,
  hasSorting: boolean,
  hasSelectedShift: boolean
): number => {
  const bottomMargin =
    hasSorting || hasSelectedShift
      ? LAYOUT_CONSTANTS.LARGE_BOTTOM_MARGIN
      : LAYOUT_CONSTANTS.BOTTOM_MARGIN;

  return windowHeight - LAYOUT_CONSTANTS.HEADER_HEIGHT - bottomMargin;
};

const smoothScrollToPosition = (
  element: HTMLElement,
  targetPosition: number,
  duration: number
): void => {
  const startPosition = element.scrollTop;
  const distanceToScroll = targetPosition - startPosition;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const easedProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    element.scrollTop = startPosition + distanceToScroll * easedProgress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

const buildVirtualizedItems = (dayShifts: DayShift[]): ListItem[] =>
  dayShifts.flatMap(({ date, shifts }) => [
    { type: 'title', date } as const,
    ...shifts.map((shift) => ({ type: 'shift', shift }) as const),
  ]);

const calculateScrollOffsetForItem = (
  itemIndex: number,
  windowHeight: number,
  getItemSize: (index: number) => number
): number => {
  let totalOffset = 0;

  for (let i = 0; i < itemIndex; i++) {
    totalOffset += getItemSize(i);
  }

  const itemHeight = getItemSize(itemIndex);
  const centeredOffset = totalOffset - (windowHeight - itemHeight) / 5;

  return Math.max(0, centeredOffset);
};

const findSelectedShiftIndex = (
  virtualizedItems: ListItem[],
  shiftId: number
): number =>
  virtualizedItems.findIndex(
    (item) => item.type === 'shift' && item.shift.id === shiftId
  );

const useScrollBehavior = (
  listRef: React.MutableRefObject<any>,
  selectedShiftId: number | undefined,
  scrollDisabled: boolean | undefined
) => {
  useEffect(() => {
    const handleWheelScroll = (event: WheelEvent) => {
      if (!listRef.current || selectedShiftId != null || scrollDisabled) return;

      const outer = listRef.current._outerRef as HTMLElement;
      const cur = outer.scrollTop;
      const max = outer.scrollHeight - outer.clientHeight;
      const next = Math.min(Math.max(0, cur + event.deltaY), max);

      if (next === cur) return;
      outer.scrollTop = next;
    };

    window.addEventListener('wheel', handleWheelScroll, {
      passive: true,
    });
    return () => window.removeEventListener('wheel', handleWheelScroll);
  }, [selectedShiftId, listRef, scrollDisabled]);
};

const useAutoScrollToSelected = (
  listRef: React.MutableRefObject<any>,
  selectedShiftId: number | undefined,
  virtualizedItems: ListItem[],
  windowHeight: number,
  getItemSize: (index: number) => number,
  hasSelectedShiftClaims: boolean
) => {
  const prevSelectedRef = useRef<number | undefined>(undefined);
  const prevClaimsRef = useRef<boolean>(hasSelectedShiftClaims);

  useEffect(() => {
    if (!listRef.current || selectedShiftId == null) return;

    const selectionChanged = prevSelectedRef.current !== selectedShiftId;
    const sizeChanged = prevClaimsRef.current !== hasSelectedShiftClaims;

    if (selectionChanged || sizeChanged) {
      const idx = findSelectedShiftIndex(virtualizedItems, selectedShiftId);
      if (idx >= 0) {
        const offset = calculateScrollOffsetForItem(
          idx,
          windowHeight,
          getItemSize
        );
        smoothScrollToPosition(
          listRef.current._outerRef,
          offset,
          LAYOUT_CONSTANTS.SCROLL_DURATION
        );
      }
    }

    prevSelectedRef.current = selectedShiftId;
    prevClaimsRef.current = hasSelectedShiftClaims;
  }, [selectedShiftId, hasSelectedShiftClaims]);
};

const useSelectedShiftValidation = (
  sortedBy: SortingOptionsEnum | undefined,
  virtualizedItems: ListItem[],
  selectedShiftId: number | undefined,
  setSelectedShiftId: (id: number | undefined) => void
) => {
  useEffect(() => {
    if (!selectedShiftId) return;

    const isSelectedShiftInList = virtualizedItems.some(
      (item) => item.type === 'shift' && item.shift.id === selectedShiftId
    );

    if (!isSelectedShiftInList) {
      setSelectedShiftId(undefined);
    }
  }, [sortedBy, virtualizedItems, selectedShiftId, setSelectedShiftId]);
};

const VirtualizedRow: React.FC<{
  index: number;
  style: React.CSSProperties;
  data: RowData;
}> = React.memo(({ index, style, data }) => {
  const { items, onSelect, selectedId, actionComponents, sortedBy } = data;
  const currentItem = items[index];

  if (!currentItem) {
    return <LoadingView />;
  }

  if (currentItem.type === 'title') {
    return (
      <div style={style} className="px-4 py-2">
        <p className="subtitle-regular">
          {formatDateWithToday(currentItem.date)}
        </p>
      </div>
    );
  }

  return (
    <div style={style}>
      <ShiftCard
        shift={currentItem.shift}
        onClick={() => onSelect(currentItem.shift.id)}
        isSelected={selectedId === currentItem.shift.id}
        actionComponents={actionComponents}
        sortedBy={sortedBy}
      />
    </div>
  );
});

export const VirtualizedShiftList: React.FC<VirtualizedShiftListProps> = ({
  dayShifts,
  actionComponents,
  sortedBy,
  hasSelectedShiftClaims,
  isNextPageLoading,
  hasNextPage,
  onLoadMore,
  scrollDisabled,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const virtualListRef = useRef<any>(null);
  const { selectedShiftId, setSelectedShiftId, selectedClaimId } =
    useShiftContext();

  const virtualizedItems = useMemo(
    () => buildVirtualizedItems(dayShifts),
    [dayShifts]
  );

  const virtualListKey = useMemo(() => {
    const totalShifts = dayShifts.reduce(
      (acc, day) => acc + day.shifts.length,
      0
    );
    const dayCount = dayShifts.length;
    return `${dayCount}-${totalShifts}-${dayShifts[0]?.date || 'empty'}`;
  }, [dayShifts]);

  const getItemSize = (index: number): number => {
    const item = virtualizedItems[index];

    if (!item || item.type === 'title') {
      return LAYOUT_CONSTANTS.DATE_HEADER_HEIGHT;
    }

    // Use appropriate height when a professional claim is open based on screen size
    if (selectedClaimId !== null) {
      return windowWidth > LAYOUT_CONSTANTS.LARGE_SCREEN_BREAKPOINT
        ? LAYOUT_CONSTANTS.LARGE_SCREEN_SHIFT_HEIGHT
        : LAYOUT_CONSTANTS.SMALL_SCREEN_SHIFT_HEIGHT;
    }
    // Here is the code to change to adapt page to mobile screens
    return calculateShiftCardHeight(hasSelectedShiftClaims, windowWidth);
  };

  const containerHeight = calculateContainerHeight(
    windowHeight,
    false,
    hasSelectedShiftClaims
  );

  useScrollBehavior(virtualListRef, selectedShiftId, scrollDisabled);
  useAutoScrollToSelected(
    virtualListRef,
    selectedShiftId,
    virtualizedItems,
    windowHeight,
    getItemSize,
    hasSelectedShiftClaims
  );
  useSelectedShiftValidation(
    sortedBy,
    virtualizedItems,
    selectedShiftId,
    setSelectedShiftId
  );

  useEffect(() => {
    virtualListRef.current?.resetAfterIndex(0);
  }, [windowHeight, hasSelectedShiftClaims, selectedClaimId]);

  const prevItemCountRef = useRef(virtualizedItems.length);
  const prevDayCountRef = useRef(dayShifts.length);

  useEffect(() => {
    const currentItemCount = virtualizedItems.length;
    const prevItemCount = prevItemCountRef.current;
    const currentDayCount = dayShifts.length;
    const prevDayCount = prevDayCountRef.current;

    const shouldReset =
      Math.abs(currentItemCount - prevItemCount) > 10 ||
      currentDayCount !== prevDayCount;

    if (shouldReset && virtualListRef.current) {
      virtualListRef.current.resetAfterIndex(0, true);

      virtualListRef.current.scrollToItem(0, 'start');
    }

    prevItemCountRef.current = currentItemCount;
    prevDayCountRef.current = currentDayCount;
  }, [virtualizedItems, dayShifts]);

  const totalItemCount = hasNextPage
    ? virtualizedItems.length + 1
    : virtualizedItems.length;
  const isItemLoaded = (index: number): boolean =>
    !hasNextPage || index < virtualizedItems.length;
  const loadMoreItems =
    !hasNextPage || isNextPageLoading ? () => Promise.resolve() : onLoadMore;

  const rowData: RowData = {
    items: virtualizedItems,
    onSelect: setSelectedShiftId,
    selectedId: selectedShiftId,
    actionComponents,
    sortedBy,
  };

  const TypedVariableSizeList = VariableSizeList as any;
  const TypedInfiniteLoader = InfiniteLoaderDefault as any;

  return (
    <div className="no-scrollbar w-full" style={{ height: containerHeight }}>
      <TypedInfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={totalItemCount}
        loadMoreItems={loadMoreItems}
        threshold={LAYOUT_CONSTANTS.LOAD_MORE_THRESHOLD}
      >
        {({ onItemsRendered, ref }: { onItemsRendered: any; ref: any }) => (
          <TypedVariableSizeList
            key={virtualListKey}
            ref={(list: VariableSizeList) => {
              ref(list);
              virtualListRef.current = list;
            }}
            height={containerHeight}
            width="100%"
            itemCount={totalItemCount}
            itemSize={getItemSize}
            itemData={rowData}
            overscanCount={LAYOUT_CONSTANTS.OVERSCAN_COUNT}
            onItemsRendered={onItemsRendered}
            className="no-scrollbar"
          >
            {VirtualizedRow}
          </TypedVariableSizeList>
        )}
      </TypedInfiniteLoader>
    </div>
  );
};
