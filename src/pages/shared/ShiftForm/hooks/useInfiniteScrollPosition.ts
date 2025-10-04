import { useCallback, useLayoutEffect, useRef } from 'react';

interface UseInfiniteScrollPositionProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  data: any[] | undefined;
}

interface UseInfiniteScrollPositionReturn {
  listboxRef: React.RefObject<HTMLUListElement | null>;
  handleListboxScroll: (event: React.SyntheticEvent) => void;
  resetScrollPosition: () => void;
}

const SCROLL_THRESHOLD = 50;
const THROTTLE_DELAY = 100;

export const useInfiniteScrollPosition = ({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  data,
}: UseInfiniteScrollPositionProps): UseInfiniteScrollPositionReturn => {
  // Refs for scroll position management
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const pendingScrollRestoreRef = useRef<number | null>(null);
  const isLoadingMoreRef = useRef<boolean>(false);
  const previousDataLengthRef = useRef<number>(0);
  const currentScrollTopRef = useRef<number>(0);
  const scrollThrottleRef = useRef<NodeJS.Timeout>();

  const handleListboxScroll = useCallback(
    (event: React.SyntheticEvent) => {
      const listbox = event.currentTarget as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = listbox;

      // Always track current scroll position
      currentScrollTopRef.current = scrollTop;

      if (!hasNextPage || isFetchingNextPage) return;

      // Throttle scroll events to prevent excessive API calls
      if (scrollThrottleRef.current) return;

      scrollThrottleRef.current = setTimeout(() => {
        scrollThrottleRef.current = undefined;
      }, THROTTLE_DELAY);

      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
        // Save current scroll position before fetching next page
        pendingScrollRestoreRef.current = scrollTop;
        isLoadingMoreRef.current = true;
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Preserve scroll position during fetching state changes
  useLayoutEffect(() => {
    if (
      isFetchingNextPage &&
      listboxRef.current &&
      currentScrollTopRef.current > 0
    ) {
      const restoreScroll = () => {
        if (listboxRef.current && currentScrollTopRef.current > 0) {
          listboxRef.current.scrollTop = currentScrollTopRef.current;
        }
      };

      // Multiple restore strategies for reliability
      restoreScroll();
      requestAnimationFrame(restoreScroll);
      const timeoutId = setTimeout(restoreScroll, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [isFetchingNextPage]);

  // Restore scroll position when new data is loaded
  useLayoutEffect(() => {
    if (!data) return;

    const currentDataLength = data.length;
    const hasNewData = currentDataLength > previousDataLengthRef.current;

    if (
      isLoadingMoreRef.current &&
      pendingScrollRestoreRef.current !== null &&
      hasNewData
    ) {
      const restoreScrollPosition = () => {
        if (listboxRef.current && pendingScrollRestoreRef.current !== null) {
          listboxRef.current.scrollTop = pendingScrollRestoreRef.current;
          pendingScrollRestoreRef.current = null;
          isLoadingMoreRef.current = false;
        }
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(restoreScrollPosition);
      });
    }

    previousDataLengthRef.current = currentDataLength;
  }, [data]);

  const resetScrollPosition = useCallback(() => {
    pendingScrollRestoreRef.current = null;
    isLoadingMoreRef.current = false;
    previousDataLengthRef.current = 0;
    currentScrollTopRef.current = 0;

    if (scrollThrottleRef.current) {
      clearTimeout(scrollThrottleRef.current);
      scrollThrottleRef.current = undefined;
    }
  }, []);

  return {
    listboxRef,
    handleListboxScroll,
    resetScrollPosition,
  };
};
