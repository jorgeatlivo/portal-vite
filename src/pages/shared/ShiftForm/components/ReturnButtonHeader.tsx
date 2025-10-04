import { PropsWithChildren } from 'react';

import { IconButton } from '@mui/material';
import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

type Props = PropsWithChildren<{
  goBack: () => void;
  title: string;
  wide?: boolean;
}>;

export const ReturnButtonHeader = ({
  goBack,
  title,
  children,
  wide,
}: Props) => (
  <header
    className={clsx(
      'mt-large flex w-full max-w-[100vw] flex-row',
      !!children ? 'items-start md:items-center' : 'items-center',
      wide ? 'md:max-w-[1500px]' : 'md:max-w-[1000px]'
    )}
  >
    <IconButton onClick={goBack} size="large" sx={{ mr: 1 }}>
      <LivoIcon size={24} name={'arrow-left'} color={colors['Neutral-999']} />
    </IconButton>
    <div
      className={'flex flex-col items-start gap-4 md:flex-row md:items-center'}
    >
      <Typography variant="heading/medium">{title}</Typography> {children}
    </div>
  </header>
);
