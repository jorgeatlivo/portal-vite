import React, { useState } from 'react';

import { CircularProgress } from '@mui/material';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface RejectButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
}

export const RejectButton: React.FC<RejectButtonProps> = ({
  onClick,
  isDisabled,
  isLoading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      disabled={isDisabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
                ring-solid flex items-center justify-center
                rounded-[80px] bg-white p-small ring-1 ring-Negative-200 transition-colors duration-300 ease-in-out hover:bg-Negative-500 hover:ring-Negative-500`}
      onClick={() => {
        onClick();
        setIsHovered(false);
      }}
    >
      {isLoading ? (
        <CircularProgress
          size={16}
          sx={{
            color: colors[isHovered ? 'Neutral-000' : 'Red-500'],
          }}
        />
      ) : (
        <LivoIcon
          name="close"
          size={16}
          color={colors[isHovered ? 'Neutral-000' : 'Red-500']}
        />
      )}
    </button>
  );
};
