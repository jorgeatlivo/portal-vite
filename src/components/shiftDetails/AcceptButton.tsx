import React, { useState } from 'react';

import { CircularProgress } from '@mui/material';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface AcceptButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
}

export const AcceptButton: React.FC<AcceptButtonProps> = ({
  onClick,
  isDisabled,
  isLoading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
                ring-solid flex items-center justify-center
                rounded-[80px] bg-white p-small ring-1 ring-Primary-500 transition-colors duration-300 ease-in-out hover:bg-Primary-500`}
    >
      {isLoading ? (
        <CircularProgress
          size={16}
          sx={{
            color: isHovered ? 'white' : colors['Primary-500'],
          }}
        />
      ) : (
        <LivoIcon
          name="check"
          size={16}
          color={isHovered ? 'white' : colors['Primary-500']}
        />
      )}
    </button>
  );
};
