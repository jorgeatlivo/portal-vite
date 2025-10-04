import React from 'react';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface ActionItemProps {
  label: React.ReactNode;
  iconName: string;
  iconColor?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

const ActionItem: React.FC<ActionItemProps> = ({
  label,
  iconName,
  iconColor,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`pv-tiny flex w-full items-center justify-between px-small ${
        disabled ? 'cursor-not-allowed' : ''
      } ${className}`}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <Typography
        variant="body/regular"
        color={colors[disabled ? 'Neutral-300' : 'Text-Default']}
      >
        {label}
      </Typography>
      <LivoIcon
        size={24}
        name={iconName}
        color={iconColor ?? colors[disabled ? 'Neutral-300' : 'Grey-700']}
      />
    </button>
  );
};

export default ActionItem;
