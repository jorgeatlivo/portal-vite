import React from 'react';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';
import LivoIcon from './LivoIcon';
import { MaterialActionButton } from './MaterialActionButton';

export const MainPageHeader = ({
  title,
  counter,
  buttonLabel,
  action,
  icon,
}: {
  title: string;
  counter?: number;
  buttonLabel?: string;
  action?: () => void;
  icon?: string;
}) => (
  <div className="mb-large flex w-full flex-col flex-wrap items-center justify-center gap-4 space-x-small md:flex-row md:items-start md:justify-between">
    <div className="mr-small flex items-center space-x-small">
      <Typography variant="heading/large">{title}</Typography>
      {counter !== undefined && counter > 0 ? (
        <span className="!text-f01 leading-r02 text-Text-Subtle">
          ({counter})
        </span>
      ) : null}
    </div>
    {title && action && (
      <MaterialActionButton
        tint={colors['Primary-500']}
        variant="outlined"
        onClick={action}
        sx={{ px: 4, py: '5px' }}
        startIcon={
          icon && (
            <LivoIcon name={icon} size={24} color={colors['Primary-500']} />
          )
        }
      >
        {buttonLabel}
      </MaterialActionButton>
    )}
  </div>
);
