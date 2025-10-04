import { CircularProgress } from '@mui/material';

import colors from '@/config/color-palette';

interface ActionButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  color?: string;
  inverse?: boolean;
  style?: any;
  tailwindStyle?: string;
}
export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  isDisabled,
  isLoading,
  children,
  color,
  inverse,
  style,
  tailwindStyle,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
                flex w-full shrink-0 grow-0 items-center justify-center rounded-[100px]
                px-xLarge py-small
                text-s03 font-bold text-white
                ${isDisabled ? 'cursor-not-allowed ring-1 ring-Neutral-100' : 'cursor-pointer'}
                ${inverse ? 'ring-1 ring-Divider-Default' : ''}
                ${inverse ? 'bg-transparent' : ' bg-Primary-500'}
                ${tailwindStyle || ''}
            `}
      style={{
        backgroundColor: isDisabled
          ? colors['Grey-400']
          : inverse
            ? '#FFFFF'
            : color,
        ...style,
      }}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </button>
  );
};
