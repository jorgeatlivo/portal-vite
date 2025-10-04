import { PropsWithChildren } from 'react';

import { HeaderComponent } from '@/components/publishShift/HeaderComponent';

type Props = PropsWithChildren<{
  title: string;
  closeModal: () => void;
  goBack?: () => void;
}>;

export const ModalWindow: React.FC<Props> = ({
  title,
  closeModal,
  goBack,
  children,
}) => (
  <div className="flex size-full max-h-[90dvh] flex-col items-start overflow-hidden rounded-lg bg-white">
    <HeaderComponent title={title} onClose={closeModal} goBack={goBack} />
    {children}
  </div>
);
