import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import clsx from 'clsx';

import AnimatedSwitch from '@/components/common/animation/AnimatedSwitch';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface RecurentTogglerProps {
  isRecurrent: boolean;
  setIsRecurrent: (isRecurrent: boolean) => void;
  disabled?: boolean;
}

export const RecurrentToggler: React.FC<RecurentTogglerProps> = ({
  isRecurrent,
  setIsRecurrent,
  disabled = false,
}) => {
  const { t } = useTranslation('publish-shift');
  return (
    <Box
      className={clsx(
        'item-center flex w-full flex-1 justify-between gap-2 rounded-lg border border-solid border-Divider-Default p-4',
        { 'opacity-50': disabled }
      )}
    >
      <LivoIcon name="repeat" size={24} color={colors['Grey-400']} />
      <p className="body-regular w-full text-left text-Text-Default">
        {t('recurrent_label')}
      </p>
      <AnimatedSwitch
        checked={isRecurrent}
        onChange={() => setIsRecurrent(!isRecurrent)}
        color="primary"
        size="small"
        disabled={disabled}
      />
    </Box>
  );
};
