export enum FontSizeEnum {
  s01 = '11px',
  s012 = '12px',
  s02 = '13px',
  l03 = '15px',
  s03 = '16px',
  s04 = '19px',
  s05 = '23px',
  s06 = '27px',
  s07 = '32px',
}

export enum LineHeightEnum {
  s01 = '16px',
  s02 = '20px',
  s03 = '24px',
  s04 = '28px',
  s05 = '32px',
  s06 = '36px',
  s07 = '40px',
}

export enum LetterSpacingEnum {
  none = '0px',
  tiny = '0.15px',
  small = '0.2px',
  medium = '0.25px',
}

export enum FontWeightEnum {
  strong = '700',
  medium = '500',
  regular = '400',
}

export type TextProperties = {
  fontSize: FontSizeEnum;
  lineHeight: LineHeightEnum;
  fontFamily: 'Roboto';
  letterSpacing: LetterSpacingEnum;
  fontWeight: FontWeightEnum;
  color?: string;
};

export type TextSize = Partial<{
  xLarge: TextProperties;
  large: TextProperties;
  medium: TextProperties;
  small: TextProperties;
  regular: TextProperties;
  caption: TextProperties;
  overline: TextProperties;
  label: TextProperties;
}>;

export type TypographyStyles = {
  heading: TextSize;
  subtitle: TextSize;
  body: TextSize;
  action: TextSize;
  info: TextSize;
  link: TextSize;
  input: TextSize;
};

export const typographyStyles: TypographyStyles = {
  heading: {
    xLarge: {
      fontSize: FontSizeEnum.s07,
      lineHeight: LineHeightEnum.s07,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.strong,
    },
    large: {
      fontSize: FontSizeEnum.s06,
      lineHeight: LineHeightEnum.s06,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.strong,
    },
    medium: {
      fontSize: FontSizeEnum.s05,
      lineHeight: LineHeightEnum.s05,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.strong,
    },
    small: {
      fontSize: FontSizeEnum.s04,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.strong,
    },
  },
  subtitle: {
    regular: {
      fontSize: FontSizeEnum.s03,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s02,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
    },
    xLarge: {
      fontSize: FontSizeEnum.s05,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
      lineHeight: LineHeightEnum.s04,
      letterSpacing: LetterSpacingEnum.none,
    },
  },
  body: {
    regular: {
      fontSize: FontSizeEnum.s03,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.regular,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.regular,
    },
    large: {
      fontSize: FontSizeEnum.s04,
      lineHeight: LineHeightEnum.s04,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.regular,
    },
  },
  action: {
    regular: {
      fontSize: FontSizeEnum.s03,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.medium,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.small,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
    },
  },
  info: {
    caption: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s02,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.regular,
    },
    overline: {
      fontSize: FontSizeEnum.s01,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.regular,
    },
  },
  link: {
    regular: {
      fontSize: FontSizeEnum.l03,
      lineHeight: LineHeightEnum.s03,
      letterSpacing: LetterSpacingEnum.medium,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
      color: '#139EF2',
    },
    small: {
      fontSize: FontSizeEnum.s02,
      lineHeight: LineHeightEnum.s02,
      letterSpacing: LetterSpacingEnum.none,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.medium,
      color: '#139EF2',
    },
  },
  input: {
    label: {
      fontSize: FontSizeEnum.s012,
      lineHeight: LineHeightEnum.s01,
      letterSpacing: LetterSpacingEnum.tiny,
      fontFamily: 'Roboto',
      fontWeight: FontWeightEnum.regular,
    },
  },
};
