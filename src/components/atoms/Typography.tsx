import React, { useMemo } from 'react';

import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from '@mui/material';
import clsx from 'clsx';

import { Logger } from '@/services/logger.service';

import {
  TextProperties,
  TextSize,
  TypographyStyles,
  typographyStyles,
} from '@/styles/livoFonts';

type TypographyStyle = keyof TypographyStyles;
type TypographySize = keyof TextSize;
export type TypographyVariant = `${TypographyStyle}/${TypographySize}`;

interface TypographyProps
  extends Omit<MuiTypographyProps, 'variant' | 'color'> {
  variant: TypographyVariant;
  children: React.ReactNode;
  color?: string;
  align?: 'inherit' | 'left' | 'right' | 'center' | 'justify';
  decoration?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  maxLines?: number;
}

// Style cache to store previously calculated variant styles
const styleCache: Record<string, TextProperties> = {};

// Convert align to TailwindCSS classes - moved outside component for performance
const alignClasses = {
  inherit: '',
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
  justify: 'text-justify',
} as const;

// Convert decoration to TailwindCSS classes - moved outside component for performance
const decorationClasses = {
  none: 'no-underline',
  underline: 'underline',
  'line-through': 'line-through',
  'underline line-through': 'underline line-through',
} as const;

export const Typography: React.FC<TypographyProps> = ({
  variant = '',
  children,
  color,
  align = 'left',
  decoration,
  className,
  style,
  maxLines,
  ...props
}) => {
  // Use useMemo only for expensive style computation
  const { baseStyle, tailwindClasses } = useMemo(() => {
    // Get cached variant style or compute it
    let baseStyle: TextProperties | undefined = styleCache[variant];

    if (!baseStyle) {
      // Parse the variant string to extract variant type and size
      const [variantType, sizeType] = variant.split('/') as [
        TypographyStyle,
        TypographySize,
      ];

      // Get style from typography configuration
      const variantStyle = typographyStyles[variantType] || {};
      baseStyle = variantStyle[sizeType] as TextProperties | undefined;

      // Cache the style for future use
      if (baseStyle) {
        styleCache[variant] = baseStyle;
      }
    }

    const tailwindClasses = clsx(
      alignClasses[align] || 'text-left',
      decoration && decorationClasses[decoration]
    );

    return { baseStyle, tailwindClasses };
  }, [variant, align, decoration]);

  if (!baseStyle) {
    Logger.warn(`Style not found for variant: ${variant}`);
    return (
      <MuiTypography
        className={clsx('text-gray-900', tailwindClasses, className)}
        style={style}
        {...props}
      >
        {children}
      </MuiTypography>
    );
  }

  // Simple object creation - no need for useMemo
  const convertedStyle = {
    fontSize: baseStyle.fontSize,
    fontWeight: baseStyle.fontWeight,
    lineHeight: baseStyle.lineHeight,
    letterSpacing: baseStyle.letterSpacing,
    fontFamily: baseStyle.fontFamily,
    color,
    ...style,
  };

  // Render with optimized styles
  return (
    <MuiTypography
      className={clsx('text-Text-Default', tailwindClasses, className)}
      style={convertedStyle}
      sx={
        maxLines
          ? {
              display: '-webkit-box',
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          : {}
      }
      {...props}
    >
      {children}
    </MuiTypography>
  );
};
