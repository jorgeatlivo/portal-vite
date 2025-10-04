import { memo, useMemo } from 'react';

interface ColoredIconProps {
  src: string;
  alt: string;
  color?: string;
  colorClass?: string;
  className?: string;
}

// Memoized ColoredIcon component to prevent unnecessary re-renders
const ColoredIcon = memo(
  ({ src, alt, color, colorClass, className = 'size-6' }: ColoredIconProps) => {
    // Create style objects once to avoid creating new objects on every render
    const maskStyle = useMemo(
      () => ({
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
      }),
      [src]
    );

    const colorStyle = useMemo(
      () =>
        color
          ? {
              backgroundColor: color,
              ...maskStyle,
            }
          : null,
      [color, maskStyle]
    );

    if (colorClass) {
      return (
        <div
          className={`${className} ${colorClass}`}
          style={maskStyle}
          role="img"
          aria-label={alt}
        />
      );
    }

    if (color && colorStyle) {
      return (
        <div
          className={className}
          style={colorStyle}
          role="img"
          aria-label={alt}
        />
      );
    }

    return <img src={src} alt={alt} className={className} />;
  }
);

ColoredIcon.displayName = 'ColoredIcon';

export default ColoredIcon;
