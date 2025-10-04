/**
 * Typography utility classes for Tailwind CSS
 * These classes correspond to the typography styles defined in livoFonts.ts
 * but are now implemented as Tailwind CSS custom component classes
 */

export const typographyClasses = {
  heading: {
    xLarge: 'heading/xLarge',
    large: 'heading/large',
    medium: 'heading/medium',
    small: 'heading/small',
  },
  subtitle: {
    xLarge: 'subtitle/xLarge',
    regular: 'subtitle/regular',
    small: 'subtitle/small',
  },
  body: {
    large: 'body/large',
    regular: 'body/regular',
    small: 'body/small',
  },
  action: {
    regular: 'action/regular',
    small: 'action/small',
  },
  info: {
    caption: 'info/caption',
    overline: 'info/overline',
  },
  link: {
    regular: 'link/regular',
    small: 'link/small',
  },
} as const;

/**
 * Helper function to get typography class name
 * Usage: getTypographyClass('heading', 'large') returns 'heading-large'
 */
export const getTypographyClass = (
  type: keyof typeof typographyClasses,
  size: string
): string => {
  const typeClasses = typographyClasses[type] as Record<string, string>;
  return typeClasses[size] || '';
};

/**
 * Type definitions for typography class keys
 */
export type TypographyType = keyof typeof typographyClasses;
export type HeadingSize = keyof typeof typographyClasses.heading;
export type SubtitleSize = keyof typeof typographyClasses.subtitle;
export type BodySize = keyof typeof typographyClasses.body;
export type ActionSize = keyof typeof typographyClasses.action;
export type InfoSize = keyof typeof typographyClasses.info;
export type LinkSize = keyof typeof typographyClasses.link;
