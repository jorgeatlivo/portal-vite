import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';

import styles from './offer-list.module.scss';

interface OfferRowProps {
  children: React.ReactNode;
  index: number;
}

// Visibility status types
type VisibilityStatus = 'hidden' | 'visible-initial' | 'visible-scrolled';

const OfferRow: React.FC<OfferRowProps> = ({ children, index }) => {
  // Single state to track visibility status
  const [visibilityStatus, setVisibilityStatus] =
    useState<VisibilityStatus>('hidden');
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create animation style based on visibility status
  const animationStyle = useMemo(
    () =>
      ({
        '--animation-delay':
          visibilityStatus === 'visible-initial' ? `${index * 0.05}s` : '0s',
      }) as React.CSSProperties,
    [index, visibilityStatus]
  );

  // Generate class name using clsx for better readability and performance
  const className = useMemo(
    () =>
      clsx(styles['offer-item'], {
        [styles['visible']]: visibilityStatus !== 'hidden',
      }),
    [visibilityStatus]
  );

  // Check initial visibility once on mount
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Optimized viewport detection
      const isInViewport = rect.bottom > 0 && rect.top < viewHeight;

      if (isInViewport) {
        setVisibilityStatus('visible-initial');
      }
    });
  }, []);

  // Intersection handler for scrolled items
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisibilityStatus('visible-scrolled');
        // Clean up observer after detection
        observerRef.current?.disconnect();
        observerRef.current = null;
      }
    },
    []
  );

  // Setup observer for items not initially visible
  useEffect(() => {
    // Skip if already visible or observer already exists
    if (visibilityStatus !== 'hidden' || observerRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '150px',
    });

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [visibilityStatus, handleIntersection]);

  return (
    <div ref={ref} className={className} style={animationStyle}>
      {children}
    </div>
  );
};

export default memo(OfferRow);
