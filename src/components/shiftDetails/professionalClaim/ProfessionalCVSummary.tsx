import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface ProfessionalCVSummaryProps {
  cvSummary: string;
  className?: string;
}

export function ProfessionalCVSummary({
  cvSummary,
  className,
}: ProfessionalCVSummaryProps) {
  const { t } = useTranslation('professional-claim');
  return (
    <div className={'p-medium ' + (className || '')}>
      <div className="mb-large flex flex-row items-center space-x-small">
        <LivoIcon name="sparkles" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">{t('cv_summary_title')}</Typography>
      </div>
      <Typography
        variant="body/regular"
        color={colors['Text-Subtle']}
        className="mb-small"
      >
        {cvSummary}
      </Typography>
    </div>
  );
}
