import React from 'react';

import { Tooltip } from '@mui/material';
import { IconInfoCircle } from '@tabler/icons-react';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';

interface SectionHeaderProps {
  title: string;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function SectionHeader({
  title,
  tooltip,
  tooltipPlacement = 'bottom',
  className = '',
}: SectionHeaderProps) {
  return (
    <span className={`flex flex-row items-center gap-1 ${className}`}>
      <Typography variant="subtitle/regular">{title}</Typography>
      {tooltip && (
        <Tooltip
          sx={{ whiteSpace: 'pre-line' }}
          title={tooltip}
          placement={tooltipPlacement}
        >
          <IconInfoCircle size={16} color={colors['Text-Default']} />
        </Tooltip>
      )}
    </span>
  );
}

export default SectionHeader;
