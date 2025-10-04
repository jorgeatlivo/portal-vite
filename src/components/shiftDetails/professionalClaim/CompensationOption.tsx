import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { CompensationOption } from '@/types/claims';

import colors from '@/config/color-palette';

interface CompensationOptionProps {
  compensationOption: CompensationOption;
}

export const CompensationOptionComponent: React.FC<CompensationOptionProps> = ({
  compensationOption,
}) => {
  const { t } = useTranslation('shift-claim-details');
  return (
    <div className="flex w-full flex-col p-medium">
      <div className="mb-large flex flex-row space-x-small">
        <LivoIcon name="report-medical" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">
          {t('compensation_option_type_label')}
        </Typography>
      </div>
      <div className="ring-solid flex w-full flex-col justify-center rounded-[8px] p-medium text-center ring-1  ring-Divider-Subtle">
        <Typography variant="body/regular" className="text-center">
          {compensationOption.label}
        </Typography>
        <Typography variant="heading/medium" className="text-center">
          {compensationOption.compensationValue}
        </Typography>
      </div>
    </div>
  );
};
