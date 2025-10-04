import React, { forwardRef, useCallback } from 'react';

import { CircularProgress } from '@mui/material';

interface InfiniteScrollListboxProps
  extends React.HTMLAttributes<HTMLUListElement> {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onScroll: (event: React.SyntheticEvent) => void;
  listboxRef: React.RefObject<HTMLUListElement | null>;
}

const InfiniteScrollListbox = forwardRef<
  HTMLUListElement,
  InfiniteScrollListboxProps
>(
  (
    {
      children,
      isFetchingNextPage,
      hasNextPage,
      onScroll,
      listboxRef,
      ...props
    },
    ref
  ) => {
    const handleRef = useCallback(
      (element: HTMLUListElement | null) => {
        // Set internal ref for scroll position management
        if (listboxRef) {
          (
            listboxRef as React.MutableRefObject<HTMLUListElement | null>
          ).current = element;
        }

        // Forward ref to MUI
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLUListElement | null>).current =
            element;
        }
      },
      [ref, listboxRef]
    );

    return (
      <ul
        {...props}
        ref={handleRef}
        onScroll={onScroll}
        style={{ maxHeight: 400 }}
      >
        {children}
        {isFetchingNextPage && hasNextPage && (
          <li style={{ padding: '8px 16px', textAlign: 'center' }}>
            <CircularProgress size={20} />
          </li>
        )}
      </ul>
    );
  }
);

InfiniteScrollListbox.displayName = 'InfiniteScrollListbox';

export default InfiniteScrollListbox;
