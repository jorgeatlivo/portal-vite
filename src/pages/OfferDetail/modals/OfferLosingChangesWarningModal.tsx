import { useTranslation } from 'react-i18next';

import { IconX } from '@tabler/icons-react';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import colors from '@/config/color-palette';

interface Props {
  edit?: boolean;
  close: () => void;
  cancel: () => void;
  confirm: () => void;
}

export const LosingChangesWarningModal = ({
  edit,
  close,
  cancel,
  confirm,
}: Props) => {
  const { t } = useTranslation('content-loss-warning');

  return (
    <main className="p-medium">
      <header className="flex flex-col">
        <div className="self-end">
          <button
            type="button"
            onClick={close}
            className="self-right rounded-full p-1 "
          >
            <IconX size={24} color={colors['Text-Subtle']} />
          </button>
        </div>
        <p className="heading-md -mt-large mb-xLarge text-center">
          {t('title')}
        </p>
      </header>
      <div className="flex flex-col px-medium pb-medium">
        <p className="body-regular mb-[40px] text-center">
          {t(edit ? 'edit_offer_body' : 'create_offer_body')}
        </p>
        <footer className="flex w-full flex-row gap-3">
          <MaterialActionButton
            className="flex-1"
            variant="outlined"
            tint={colors['Red-500']}
            onClick={cancel}
          >
            {t('discard_button')}
          </MaterialActionButton>

          <MaterialActionButton
            className="flex-1"
            tint={colors['Primary-500']}
            variant="contained"
            onClick={confirm}
          >
            {t(edit ? 'edit_button' : 'return_button')}
          </MaterialActionButton>
        </footer>
      </div>
    </main>
  );
};
