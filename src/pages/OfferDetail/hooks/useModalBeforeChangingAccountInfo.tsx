import { ReactNode, useEffect, useRef } from 'react';

import { useAccountChangeInterceptor } from '@/components/layout/components/AccountChangeInterceptor';

import { useModal } from '@/hooks/use-modal';

export const useModalBeforeChangingAccountInfo = (
  modalFactory: (
    confirmChange: () => void,
    cancelChange: () => void
  ) => ReactNode
) => {
  const { setInterceptor } = useAccountChangeInterceptor();
  const { openModal, closeModal } = useModal();
  const resolver = useRef<(value: boolean) => void>();

  useEffect(() => {
    const confirmBeforeSwitch = () => {
      const cancel = () => {
        resolver.current?.(false);
        closeModal();
      };

      const confirm = () => {
        resolver.current?.(true);
        closeModal();
      };

      openModal(modalFactory(confirm, cancel), {
        className:
          '!bg-Grey-050 w-[450px] max-w-[95dvw] !shadow-lg !rounded-2xl !p-0 !overflow-hidden',
      });

      return new Promise<boolean>((resolve) => {
        resolver.current = resolve;
      });
    };

    setInterceptor(confirmBeforeSwitch);
    return () => setInterceptor(null);
  }, [closeModal, modalFactory, openModal, setInterceptor]);
};
