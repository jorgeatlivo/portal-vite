import React from 'react';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import { ActionButton } from './ActionButton';
import { ModalContainer } from './ModalContainer';

interface ConfirmationModalProps {
  isOpen: boolean;
  handleClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  buttonTitle: string;
  dismissTitle: string;
  buttonIsLoading?: boolean;
  dismissIsLoading?: boolean;
  buttonColor?: string;
  onPress: () => void;
  onDismiss: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  handleClose,
  title,
  subtitle,
  children,
  buttonTitle,
  dismissTitle,
  buttonIsLoading = false,
  dismissIsLoading = false,
  buttonColor = colors['Negative-400'],
  onPress,
  onDismiss,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={handleClose}
      style={{ width: '60%', minWidth: '90vw', maxWidth: '700px' }}
    >
      <div className="z-50 mx-auto flex flex-col gap-3 overflow-y-auto rounded-[16px] bg-white p-large  md:w-[448px]">
        {title && <Typography variant="heading/small">{title}</Typography>}
        {subtitle && <Typography variant="body/regular">{subtitle}</Typography>}

        {children}

        <div className="mt-large flex flex-row items-center justify-between">
          <div className="w-[200px]">
            <ActionButton
              onClick={onDismiss}
              isLoading={dismissIsLoading}
              style={{
                color: colors['Primary-500'],
                backgroundColor: '#FFFFFF',
              }}
            >
              {dismissTitle}
            </ActionButton>
          </div>
          <div className="w-[200px]">
            <ActionButton
              onClick={onPress}
              isLoading={buttonIsLoading}
              style={{ backgroundColor: buttonColor }}
            >
              {buttonTitle}
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
