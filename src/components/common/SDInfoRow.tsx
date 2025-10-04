import { CSSProperties } from 'react';

import { TextDTO } from '@/types/common/widgets';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import LivoIcon from './LivoIcon';
import { SDText } from './SDText';

interface InfoRowProps {
  title?: string;
  subtitle?: string;
  titleTypography?: TextDTO;
  subtitleTypography?: TextDTO;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  textStyle?: CSSProperties;
}

export const SDInfoRow: React.FC<InfoRowProps> = ({
  titleTypography,
  title,
  subtitleTypography,
  subtitle,
  iconName,
  iconSize = 24,
  iconColor = colors['Grey-700'],
  textStyle,
}) => (
  <div className="flex flex-row items-start">
    {iconName && (
      <div className="mr-1">
        <LivoIcon name={iconName} size={iconSize} color={iconColor} />
      </div>
    )}

    {titleTypography ? (
      <div className="flex flex-col items-start">
        <SDText {...titleTypography} />
        {subtitleTypography && <SDText {...subtitleTypography} />}
      </div>
    ) : title ? (
      <>
        {title && (
          <Typography variant="body/regular" style={textStyle}>
            {title}
          </Typography>
        )}

        {subtitle && (
          <Typography
            variant="body/regular"
            className="pl-2"
            color={colors['Text-Subtle']}
            style={textStyle}
          >
            {subtitle}
          </Typography>
        )}
      </>
    ) : null}
  </div>
);
