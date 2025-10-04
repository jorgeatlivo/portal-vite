import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface SingleSelectItemProps {
  checked: boolean;
  onClick: () => void;
  option: string;
  disclaimer?: string;
}

export const SingleSelectItem: React.FC<SingleSelectItemProps> = ({
  checked,
  onClick,
  option,
  disclaimer,
}) => {
  return (
    <button
      type="button"
      className="m-x-tiny flex items-center justify-between"
      onClick={onClick}
    >
      <div className="flex flex-col justify-start text-left">
        <p
          className={
            checked
              ? 'subtitle-regular text-Primary-500'
              : 'body-regular text-Text-Subtle'
          }
        >
          {option}
        </p>
        <p className="body-sm text-Text-Subtle">{disclaimer}</p>
      </div>
      {}
      <LivoIcon
        size={24}
        name={checked ? 'radio-filled' : 'circle'}
        color={colors[checked ? 'Primary-500' : 'Neutral-600']}
      />
    </button>
  );
};
