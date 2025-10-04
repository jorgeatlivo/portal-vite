import { useTranslation } from 'react-i18next';

import { MenuItem, TextField } from '@mui/material';

export enum SortingOptionsEnum {
  SHIFT_TIME = 'SHIFT_TIME',
  SHIFT_PUBLICATION_TIME = 'SHIFT_PUBLICATION_TIME',
}

const SortingOptionsMap = {
  [SortingOptionsEnum.SHIFT_TIME]: 'Turno',
  [SortingOptionsEnum.SHIFT_PUBLICATION_TIME]: 'Publicación',
};

interface SortingSelectorProps {
  selectedOption: SortingOptionsEnum;
  options: SortingOptionsEnum[];
  onChange: (value: string) => void;
  className?: string;
}

const SortingSelector: React.FC<SortingSelectorProps> = ({
  selectedOption,
  options,
  onChange,
  className,
}) => {
  const { t } = useTranslation('shift-claim-list');
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span>{t('sort_by_date_label')}</span>

      <TextField
        select
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        style={{
          borderRadius: 12,
          overflow: 'hidden',
        }}
        sx={{
          backgroundColor: 'white',
          minWidth: 120,
        }}
      >
        {options.map((option) => (
          <MenuItem value={option}>{SortingOptionsMap[option]}</MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default SortingSelector;
