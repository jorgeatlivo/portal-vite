import React, { CSSProperties } from 'react';

import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';

import { Typography, TypographyVariant } from '@/components/atoms/Typography';

export interface ChipProps {
  label?: string;
  icon?: React.ReactNode;
  style?: CSSProperties;
  className?: string;
  onDelete?: () => void;
  trimLength?: number;
  variant?: TypographyVariant;
}

/**
 * a Custom Chip component to replace MUI Chip
 */
function Chip({
  label,
  style,
  icon,
  className,
  onDelete,
  trimLength = 100,
  variant = 'body/small',
}: ChipProps) {
  return (
    <div
      className={clsx(
        'flex w-fit items-center gap-2 rounded-[4px] bg-[#f0f0f0] p-1',
        className
      )}
      style={style}
    >
      {icon ?? null}

      <Typography
        variant={variant}
        className="line-clamp-1 w-fit !truncate !text-s02 !leading-s02"
      >
        {/* manual trim here due to css problem with w-fit and truncate */}
        {`${label?.slice(0, trimLength)}${(label?.length ?? 0) > trimLength ? '...' : ''}`}
      </Typography>

      {onDelete && (
        <button
          className="flex items-center justify-end rounded-full ring-blue-200"
          onClick={onDelete}
          aria-label="Delete"
          type="button"
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}

export default Chip;
