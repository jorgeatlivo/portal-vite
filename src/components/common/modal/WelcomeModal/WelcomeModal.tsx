import { useTranslation } from 'react-i18next';

import { IconButton, Typography } from '@mui/material';
import { IconX } from '@tabler/icons-react';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import { useModal } from '@/hooks/use-modal';

import WelcomeSvg from '@/assets/welcome.svg';
import colors from '@/config/color-palette';

function WelcomeModal(props: { onConfirm: () => void }) {
  const { t } = useTranslation('professionals/profile');
  const { closeModal } = useModal();

  const onConfirm = () => {
    props?.onConfirm();
    closeModal();
  };

  return (
    <div className="flex w-full flex-col justify-between gap-6">
      {/* Title */}
      <div className=" flex w-full flex-row items-center justify-center">
        <Typography
          variant="h6"
          className="text-center !text-f08 font-bold text-gray-900"
        >
          {t('welcome_title')}
        </Typography>
        <div className="!absolute right-10 top-10 self-end">
          <IconButton onClick={closeModal} size="medium">
            <IconX size={24} />
          </IconButton>
        </div>
      </div>

      {/* Icon */}
      <div className="flex justify-center">
        <img src={WelcomeSvg} className="m-2 size-28" alt="Welcome" />
      </div>

      {/* Content */}
      <Typography className="text-center !text-f02 text-Text-Default">
        {t('welcome_content')}
      </Typography>

      {/* Action Button */}
      <div className="mt-10 flex justify-center">
        <MaterialActionButton
          tint={colors['Primary-500']}
          variant="contained"
          className="rounded-full bg-Primary-500 px-6 py-3 text-white hover:bg-blue-600"
          onClick={onConfirm}
        >
          <p className="text-bold min-w-72 py-tiny !text-f02 text-white">
            {t('welcome_action_button')}
          </p>
        </MaterialActionButton>
      </div>
    </div>
  );
}

export default WelcomeModal;
