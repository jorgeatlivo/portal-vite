import clsx from 'clsx';

import LivoIcon from '@/components/common/LivoIcon';

import { modalityTags } from '@/utils/constants';

import { ShiftModalityEnum } from '@/types';

interface ModalityTagProps {
  modality: ShiftModalityEnum;
  style?: any;
  shortTag?: boolean;
}

export const ModalityTag: React.FC<ModalityTagProps> = ({
  modality,
  shortTag,
  style,
}) => {
  const modalityProps = modalityTags[modality];
  return shortTag ? (
    <div
      style={{
        backgroundColor: modalityProps.backgroundColor,
      }}
      className={`flex size-xLarge items-center justify-center rounded-[100px] p-0 ${style}`}
    >
      <div className={clsx(modalityProps.iconClassNames)}>
        <LivoIcon
          name={modalityProps.icon}
          size={modalityProps.size}
          color={modalityProps.color}
        />
      </div>
    </div>
  ) : (
    <div
      style={{
        backgroundColor: modalityProps.backgroundColor,
      }}
      className={clsx(
        'flex h-xLarge w-fit flex-row items-center justify-center gap-1',
        'rounded-[4px] border-solid p-0 px-2',
        style
      )}
    >
      <div className={modalityProps.iconClassNames}>
        <LivoIcon
          name={modalityProps.icon}
          size={modalityProps.size}
          color={modalityProps.color}
        />
      </div>
      {!!modalityProps.displayText && (
        <p className="subtitle-sm ml-tiny text-Text-Default">
          {modalityProps.displayText}
        </p>
      )}
    </div>
  );
};
