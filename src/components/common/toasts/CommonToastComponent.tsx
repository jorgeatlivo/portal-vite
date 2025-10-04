import { useEffect, useState } from 'react';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

export interface CommonToastProps {
  backgroundColor: string;
  iconColor: string;
  iconName: string;
  message: string;
  onClose: () => void;
  style?: any;
}

export const CommonToast: React.FC<CommonToastProps> = ({
  backgroundColor,
  iconColor,
  iconName,
  message,
  onClose,
  style = {},
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!show) {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 500);

      return () => {
        clearTimeout(closeTimer);
      };
    }
  }, [show, onClose]);

  return (
    <div
      className={`absolute right-4 top-4 z-[100] ml-4 flex max-w-[500px] flex-1 items-center  px-small py-medium transition-all duration-500 ${show ? 'opacity-100' : 'translate-x-full opacity-0'} rounded-[12px] shadow-xl`}
      style={{
        backgroundColor: backgroundColor,
        ...style,
      }}
    >
      <div className="flex w-full items-center space-x-small">
        <LivoIcon name={iconName} size={24} color={iconColor} />
        <p className="body-sm flex flex-1  text-Text-Default">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="flex shrink-0 items-center justify-center"
        >
          <LivoIcon name="close" size={24} color={colors['Grey-700']} />
        </button>
      </div>
    </div>
  );
};
