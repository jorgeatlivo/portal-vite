import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  dropdownContent: React.ReactNode;
}

export function DropdownWrapper({
  children,
  isOpen,
  dropdownContent,
}: DropdownPortalWrapperProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollableParentRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const getScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
    while (el) {
      const style = getComputedStyle(el);
      if (['auto', 'scroll'].includes(style.overflowY)) return el;
      el = el.parentElement;
    }
    return null;
  };

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const dropdown = dropdownRef.current;
    if (!trigger || !dropdown) return;

    const rect = trigger.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setPosition({
      top: showAbove ? rect.top - dropdownHeight : rect.bottom,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const handleFocus = () =>
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });

    el.addEventListener('focusin', handleFocus);
    return () => el.removeEventListener('focusin', handleFocus);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const el = triggerRef.current;
    scrollableParentRef.current = getScrollableParent(el);
    if (scrollableParentRef.current)
      scrollableParentRef.current.style.overflow = 'hidden';

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      if (scrollableParentRef.current)
        scrollableParentRef.current.style.overflow = '';
    };
  }, [isOpen, updatePosition]);

  return (
    <>
      <div ref={triggerRef}>{children}</div>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 50,
            }}
          >
            {dropdownContent}
          </div>,
          document.body
        )}
    </>
  );
}
