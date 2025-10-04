import { useRef, useState } from 'react';

import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AnimatedPaper = styled(Paper)(({ theme }) => ({
  transition: 'opacity 0.2s ease, transform 0.2s ease',
  opacity: 0,
  transform: 'translateY(-10px)',
  '&.popper-enter': {
    opacity: 1,
    transform: 'translateY(0)',
  },
  '&.popper-exit': {
    opacity: 0,
    transform: 'translateY(-10px)',
  },
}));

export function useAnimatedPaper<T>() {
  const [transitioning, setTransitioning] = useState(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<T | null>(null);

  const handleOpen = (event?: React.MouseEvent<T>) => {
    if (!event?.currentTarget) return;

    anchorRef.current = event?.currentTarget;
    setTransitioning(true);
    setOpen(true);

    // Small delay to ensure transition class is applied properly
    setTimeout(() => {
      setTransitioning(false);
    }, 10);
  };

  // Handle closing the dropdown smoothly
  const handleClose = () => {
    setTransitioning(true);

    // Delay the actual closing to allow the exit animation to complete
    setTimeout(() => {
      setOpen(false);
      setTransitioning(false);
    }, 200);
  };

  const toggleOpenClose = (event?: React.MouseEvent<T>) => {
    if (transitioning) return;

    if (open) {
      handleClose();
    } else {
      handleOpen(event);
    }
  };

  return {
    transitioning,
    setTransitioning,
    open,
    setOpen,
    anchorRef,
    handleOpen,
    handleClose,
    toggleOpenClose,
  };
}
