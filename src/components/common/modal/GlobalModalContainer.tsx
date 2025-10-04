import React from 'react';

import { Backdrop, Box, Fade, Modal } from '@mui/material';
import clsx from 'clsx';

import { useModal } from '@/hooks/use-modal';

/**
 *
 * @description
 *  Global Modal is a simple system that allows to show a modal from any part of the app.
 *  Easy to use, just import the useModal hook and call openModal with the component you want to show.
 *  The modal will be shown on top of the current route.
 *  It uses the location state to store the modal content.
 *  The modal is closed when the user clicks outside of it or when the user navigates to another route.
 *  For complex modals, suggest to build self contained components.
 */
const GlobalModalContainer: React.FC = () => {
  const { modalContent, closeModal, config } = useModal();

  const isOpen = !!modalContent;

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          className: 'bg-black/50 backdrop-blur-sm',
        },
      }}
    >
      <Fade in={isOpen} timeout={300}>
        <Box
          sx={{
            outline: 'none',
            border: 'none',
            '&:focus': {
              outline: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
            },
          }}
          className={clsx(
            'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2',
            'flex-col justify-evenly rounded-lg bg-white shadow-lg',
            '!transition-all !duration-200 !ease-in-out',
            config?.className ?? 'min-h-[400px] w-[720px] p-10'
          )}
        >
          {modalContent}
        </Box>
      </Fade>
    </Modal>
  );
};

export default GlobalModalContainer;
