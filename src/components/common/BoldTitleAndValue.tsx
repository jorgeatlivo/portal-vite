import React from 'react';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';
import { CopyButton } from './CopyButton';

interface BoldTitleAndValueProps {
  title: string;
  value: string;
  placeholder?: string;
  annotation?: string;
  copyText?: string;
  copyTextSuccess?: string;
  className?: string;
}

const BoldTitleAndValue: React.FC<BoldTitleAndValueProps> = ({
  title,
  value,
  placeholder,
  annotation,
  copyText,
  copyTextSuccess,
  className,
}) => {
  if (title !== '') {
    return (
      <div className={`flex flex-row items-center ${className}`}>
        <Typography variant="body/regular" component="div">
          <b>{title}:</b> {value && value !== '' ? value : placeholder}
        </Typography>
        <Typography
          variant="body/regular"
          color={colors['Text-Secondary']}
          style={{ marginLeft: '4px' }}
        >
          {annotation && annotation !== '' ? annotation : ''}
        </Typography>

        {copyText && copyText !== '' && (
          <CopyButton
            text={copyText}
            successMessage={copyTextSuccess}
            iconSize={18}
            style={{ marginLeft: '8px' }}
          />
        )}
      </div>
    );
  }
  return null;
};

export default BoldTitleAndValue;
