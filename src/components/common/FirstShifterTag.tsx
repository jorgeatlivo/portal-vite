import { useTranslation } from 'react-i18next';

import { TagComponent } from './TagComponent';

interface FirstShifterTagProps {
  className?: string;
}

const FirstShifterTag: React.FC<FirstShifterTagProps> = ({ className }) => {
  const { t } = useTranslation('professional-claim');
  return (
    <TagComponent
      label={t('first_shifter_label')}
      className={`rounded-[4px] bg-Purple-600 p-tiny text-Neutral-000 ring-Purple-600 ${className}`}
      labelClassName="body-sm"
    />
  );
};

export default FirstShifterTag;
