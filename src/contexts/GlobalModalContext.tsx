import React, {
  createContext,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';

import { wait } from '@/utils/frame';

interface ModalConfig {
  className?: string;
}

interface ModalItem {
  content: ReactNode;
  config?: ModalConfig;
}

interface ModalContextProps {
  modalContent: ReactNode | null;
  config: ModalConfig | null;
  openModal: (content: ReactNode, config?: ModalConfig) => void;
  closeModal: () => void;
}

// Create context as before
export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined
);

// Class to manage the queue independently
class ModalQueue {
  private items: ModalItem[] = [];

  add(item: ModalItem) {
    this.items.push(item);
  }

  remove(): ModalItem | undefined {
    return this.items.shift();
  }

  peek(): ModalItem | undefined {
    return this.items[0];
  }

  get length() {
    return this.items.length;
  }
}

export const GlobalModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Only store the currently displayed modal in state to trigger re-render
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const appearFlag = useRef(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  // Use useRef to hold the instance of ModalQueue so that it doesn't trigger re-render on changes
  const modalQueueRef = useRef(new ModalQueue());

  // Function to open a modal: add modal to the queue
  const openModal = useCallback(
    (content: ReactNode, modalConfig?: ModalConfig) => {
      const newModal: ModalItem = { content, config: modalConfig };
      modalQueueRef.current.add(newModal);

      // If the queue has only one item, it means this is the first modal and should be displayed immediately
      if (modalQueueRef.current.length === 1) {
        setConfig(modalConfig || null);
        setModalContent(content);
        appearFlag.current = true;
      }
    },
    []
  );

  // Function to close a modal: remove the current modal and display the next one if available
  const closeModal = useCallback(async () => {
    modalQueueRef.current.remove();
    const nextModal = modalQueueRef.current.peek();
    if (nextModal) {
      setModalContent(nextModal.content);
      appearFlag.current = true;
      setConfig(nextModal.config || null);
    } else {
      setModalContent(null);
      appearFlag.current = false;
      await wait(300);
      // If a closing animation is needed, keep the config for a short period
      if (!appearFlag.current) setConfig(null);
    }
  }, []);

  return (
    <ModalContext.Provider
      value={{ modalContent, config, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
