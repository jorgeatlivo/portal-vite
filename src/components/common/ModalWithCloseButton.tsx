import React from 'react';
import { createPortal } from 'react-dom';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface ModalWithCloseButtonContainerProps {
  children: any;
  isOpen: boolean;
  style?: any;
  title?: string;
  onClose: () => void;
  fullScreen?: boolean;
}

// TODO - Unify all these different modal layouts into a single common one
export const ModalWithCloseButtonContainer: React.FC<
  ModalWithCloseButtonContainerProps
> = ({ children, isOpen, style, title, onClose, fullScreen }) => {
  const modalVisibilityClass = isOpen
    ? 'opacity-100 visible'
    : 'opacity-0 invisible';
  const backdropVisibilityClass = isOpen
    ? 'opacity-50 visible'
    : 'opacity-0 invisible';

  const component = (
    <div
      className={`fixed inset-0 z-50 mx-medium flex h-screen items-center justify-center overflow-y-auto transition-opacity duration-300 ${modalVisibilityClass}`}
    >
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${backdropVisibilityClass}`}
      ></div>
      <div className="relative z-10 flex size-full items-center" style={style}>
        <div
          className="no-scrollbar z-50 mx-auto flex w-full flex-col overflow-y-auto rounded-[16px] bg-white"
          style={{ maxHeight: '90%' }}
        >
          <div className="flex w-full flex-row items-center justify-between border-b border-Divider-Default p-large">
            <Typography variant="heading/medium"> {title}</Typography>
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="flex items-center justify-center"
            >
              <LivoIcon size={24} name="close" color={colors['Grey-700']} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return createPortal(component, document.body);
  }

  return component;
};
