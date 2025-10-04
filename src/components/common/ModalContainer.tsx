import React, { useEffect, useRef } from 'react';

interface ModalContainerProps {
  children: any;
  isOpen: boolean;
  onClose?: () => void;
  style?: any;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  isOpen,
  onClose,
  style,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on 'Esc' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const modalVisibilityClass = isOpen
    ? 'opacity-100 visible'
    : 'opacity-0 invisible';
  const backdropVisibilityClass = isOpen
    ? 'opacity-50 visible'
    : 'opacity-0 invisible';

  return (
    <div
      className={`fixed inset-0 z-50 !m-0 flex items-center justify-center transition-opacity duration-300 ${modalVisibilityClass}`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${backdropVisibilityClass}`}
        onClick={onClose}
      ></div>
      <div
        className="relative z-10"
        ref={modalRef}
        style={{
          ...style,
          maxHeight: '80vh',
        }}
      >
        {children}
      </div>
    </div>
  );
};
