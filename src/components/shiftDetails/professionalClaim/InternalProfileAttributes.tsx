import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';

import colors from '@/config/color-palette';
import LivoIcon from '../../common/LivoIcon';

interface InternalProfessionalAttributesProps {
  attributes: {
    label: string;
    value: string;
  }[];
}
export const InternalProfessionalAttributes: React.FC<
  InternalProfessionalAttributesProps
> = ({ attributes }) => {
  const { t } = useTranslation('professional-claim');
  return (
    <div className="flex w-full flex-col p-medium">
      <div className="mb-large flex flex-row space-x-small">
        <LivoIcon name="id-badge-2" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">
          {t('professional_data_title')}
        </Typography>
      </div>

      <div className="flex flex-col space-y-small">
        {attributes.map((attribute, index) => (
          <div key={index} className="flex flex-row gap-tiny space-x-small">
            <Typography variant="body/regular" color={colors['Text-Subtle']}>
              {attribute.label}:
            </Typography>
            <Typography variant="subtitle/regular">
              {attribute.value}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};
