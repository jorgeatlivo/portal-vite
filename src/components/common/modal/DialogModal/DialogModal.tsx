import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StackProps, Typography } from '@mui/material';

import { Logger } from '@/services/logger.service';

import DialogConfirmButtons, {
  ButtonType,
} from '@/components/common/buttons/DialogConfirmButtons';

import { useModal } from '@/hooks/use-modal';
import { isPromise } from '@/utils/functions';
import { markdown } from '@/utils/markdown';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import colors from '@/config/color-palette';

export type DialogType =
  | 'info'
  | 'warning'
  | 'alert'
  | 'success'
  | 'error'
  | 'delete'
  | 'neutral';

interface DialogModalProps {
  title: string;
  content?: string;
  onCancel?: () => void;
  onConfirm?: () => Promise<any> | void;
  confirmLabel: string;
  buttonJustify?: StackProps['justifyContent'];
  dialogType?: DialogType;
  singleOption?: boolean;
}

const CONFIRM_BUTTON_COLOR_BASED_ACTION = {
  info: colors['Primary-500'],
  warning: colors['Action-Notification'],
  alert: colors['Action-Notification'],
  success: colors['Action-Secondary'],
  error: colors['Action-Notification'],
  delete: colors['Action-Notification'],
  neutral: colors['BG-Default'],
};

export const DIALOG_MODAL_CONTAINER_CLASSES =
  '!flex flex-col !items-start !p-10 !gap-10 isolate !w-[472px] !h-auto !rounded-2xl !min-h-[200px] !min-w-[400px]';

export default function DialogModal({
  title,
  content,
  onCancel,
  onConfirm,
  confirmLabel,
  buttonJustify,
  dialogType = 'info',
  singleOption = false,
}: DialogModalProps) {
  const { t } = useTranslation('common');
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { handleUncaughtError } = useUncaughtErrorHandler();

  const handleConfirm = useCallback(async () => {
    try {
      const call = onConfirm?.();
      if (isPromise(call)) {
        setLoading(true);
        await call;
      }
    } catch (error) {
      handleUncaughtError(error, t('error_on_confirm_action'));
      Logger.error('Error on confirm action', error);
    } finally {
      setLoading(false);
      closeModal();
    }
  }, [closeModal, onConfirm]);

  const buttons = useMemo(() => {
    const _buttons: ButtonType[] = [
      {
        label: t('return_label'),
        variant: 'outlined',
        className: 'w-44 border-2 rounded-full',
        onClick: () => {
          onCancel?.();
          closeModal();
        },
      },
      {
        label: confirmLabel ?? '--',
        variant: 'contained',
        isLoading: loading,
        color: CONFIRM_BUTTON_COLOR_BASED_ACTION[dialogType],
        className: 'w-44 border-2 rounded-full',
        onClick: handleConfirm,
      },
    ];

    if (singleOption) {
      _buttons.shift();
    }

    return _buttons;
  }, [
    closeModal,
    confirmLabel,
    dialogType,
    handleConfirm,
    loading,
    onCancel,
    singleOption,
    t,
  ]);

  return (
    <div className="flex w-full flex-col items-start gap-10">
      <div className="z-1 flex w-full flex-col items-center gap-10">
        <Typography
          variant="h2"
          className="!text-center !font-semibold !text-s05 !leading-s05"
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          className="!text-center !text-s03 !leading-s03"
        >
          {markdown(content ?? '')}
        </Typography>
      </div>
      <div className="flex w-full flex-row items-center justify-end gap-6 p-0">
        <DialogConfirmButtons
          justify={buttonJustify ?? 'space-between'}
          buttons={buttons}
        />
      </div>
    </div>
  );
}
