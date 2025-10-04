import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';

interface MaterialActionButtonProps extends ButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  tint?: string;
  borderless?: boolean;
}

function buildStyles(
  variant: ButtonProps['variant'],
  tint?: string,
  borderless?: boolean
) {
  if (variant === 'text') {
    return {
      color: tint,
      backgroundColor: 'transparent',
    };
  }

  if (variant === 'outlined') {
    return {
      backgroundColor: 'inherit',
      color: tint,
      borderColor: tint,
      borderWidth: borderless ? 0 : 2,
    };
  }

  if (variant === 'contained') {
    return {
      backgroundColor: tint,
      color: '#FFFFFF',
    };
  }

  return {};
}

export const MaterialActionButton: React.FC<
  Omit<MaterialActionButtonProps, 'disabled'>
> = ({
  onClick,
  isDisabled = false,
  isLoading,
  children,
  tint,
  style,
  className,
  variant,
  borderless,
  ...rest
}) => {
  const _tint = isDisabled ? undefined : tint;

  const styles = buildStyles(variant, _tint, borderless);
  return (
    <Button
      {...rest}
      variant={variant}
      onClick={isLoading ? undefined : onClick}
      disabled={isDisabled}
      disableElevation
      className={clsx(
        // variant !== "text" && "ring-1 ring-Divider-Default",
        className
      )}
      style={{
        ...styles,
        ...style,
      }}
    >
      <div className="relative flex items-center justify-center">
        <div className={clsx(isLoading && 'opacity-0')}>{children}</div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularProgress size={24} color="inherit" />
          </div>
        )}
      </div>
    </Button>
  );
};
