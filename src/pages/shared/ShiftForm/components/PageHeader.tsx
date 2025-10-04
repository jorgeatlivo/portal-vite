import React from 'react';

import { IconButton } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons-react';

import { Typography } from '@/components/atoms/Typography';

interface PageHeaderProps {
  children?: React.ReactNode;
  title?: string;
  back?: () => void;
}

function PageHeader({ children, title, back }: PageHeaderProps) {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-between self-center md:flex-row">
      <span className="flex items-center gap-2">
        <IconButton onClick={back}>
          <IconArrowLeft size={24} className="text-Text-Default" />
        </IconButton>
        {!!title && <Typography variant="heading/medium">{title}</Typography>}
      </span>
      {children}
    </div>
  );
}

export default PageHeader;
