import { useCallback } from 'react';

import DialogModal from '@/components/common/modal/DialogModal';
import { DialogType } from '@/components/common/modal/DialogModal/DialogModal';

import { useModal } from '@/hooks/use-modal';

function useDialog() {
  const { openModal, closeModal } = useModal();

  const openDialog = useCallback(
    ({
      title,
      content,
      confirmLabel,
      onConfirm,
      dialogType = 'info',
      singleOption,
      onCancel,
    }: {
      title: string;
      content: string;
      confirmLabel: string;
      dialogType?: DialogType;
      singleOption?: boolean;
      onConfirm?: () => void;
      onCancel?: () => void;
    }) => {
      const _dialogContent = (
        <DialogModal
          buttonJustify={'space-evenly'}
          dialogType={dialogType}
          confirmLabel={confirmLabel}
          title={title}
          content={content}
          singleOption={singleOption}
          onConfirm={() => {
            onConfirm?.();
          }}
          onCancel={() => {
            onCancel?.();
          }}
        />
      );

      openModal(_dialogContent, {
        className:
          '!flex flex-col !items-start !p-10 !gap-10 isolate !w-[600px] !h-auto !rounded-2xl !min-h-[100px] !min-w-[400px]',
      });
    },
    [openModal]
  );

  return {
    openDialog,
    closeDialog: closeModal,
  };
}

export default useDialog;
