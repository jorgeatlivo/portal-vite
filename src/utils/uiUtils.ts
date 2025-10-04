import { typographyStyles } from '@/styles/livoFonts';

export function resolveTypographyStyles(style?: string, size?: string) {
  if (!!style && !!size) {
    const styles = typographyStyles as any;
    if (style in styles && size in styles[style]) {
      return styles[style][size];
    }
  }
  return {};
}

export function resolveIconSize(size: string) {
  if (size.endsWith('px') && /^\d{1,}px$/.test(size)) {
    return parseInt(size.replace('px', ''), 10) || 100;
  }
  if (size.endsWith('%') && /^\d{1,3}%$/.test(size)) {
    const percent = parseInt(size.replace('%', ''), 10) || 100;
    return (window.innerWidth * percent) / 100;
  }
  return 1;
}
