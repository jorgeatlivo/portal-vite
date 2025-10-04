import colors from '@/config/color-palette';
import LivoIcon from './LivoIcon';

interface MultiSelectItemProps {
  checked: boolean;
  onClick: () => void;
  option: string;
  disclaimer?: string;
}

export const MultiSelectItem: React.FC<MultiSelectItemProps> = ({
  checked,
  onClick,
  option,
  disclaimer,
}) => {
  return (
    <button
      type="button"
      className="m-x-tiny flex w-full items-center justify-between"
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
        name={checked ? 'square-check-filled' : 'square'}
        size={24}
        color={colors[checked ? 'Primary-500' : 'Neutral-600']}
      />
    </button>
  );
};
