import React, { CSSProperties } from 'react';

import { Stack, StackProps } from '@mui/material';
import clsx from 'clsx';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import colors from '@/config/color-palette';

export type ButtonType = {
  isLoading?: boolean;
  label: string;
  color?: string;
  variant?: 'text' | 'contained' | 'outlined';
  style?: CSSProperties;
  className?: string;
  onClick: () => void;
};

const DialogConfirmButtons = ({
  buttons,
  justify = 'flex-end',
}: {
  justify?: StackProps['justifyContent'];
  buttons: ButtonType[];
}) => {
  return (
    <Stack
      direction="row"
      justifyContent={justify}
      className="mt-2 w-full"
      spacing={1}
    >
      {buttons.map((button, index) => (
        <MaterialActionButton
          isLoading={button.isLoading}
          key={`${button.label}-${button.variant}-${index}`}
          variant={button.variant || 'text'}
          tint={button.color || colors['Primary-500']}
          onClick={button.onClick}
          className={clsx(button.className ?? '!rounded-md !border-0 !px-3')}
          style={{
            boxShadow: 'none',
            ...(button.style ?? {}),
          }}
        >
          {button.label}
        </MaterialActionButton>
      ))}
    </Stack>
  );
};

export default DialogConfirmButtons;
