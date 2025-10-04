import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface HeaderComponentProps {
  title: string;
  onClose: () => void;
  goBack?: () => void;
}

export const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  onClose,
  goBack,
}) => {
  return (
    <div className="flex w-full flex-row items-center justify-between border-b border-Divider-Default p-large">
      <div className="flex items-center space-x-small">
        {goBack ? (
          <div onClick={goBack}>
            <LivoIcon
              size={24}
              name="chevron-left"
              color={colors['Grey-950']}
            />
          </div>
        ) : null}
        <p className="heading-sm">{title}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center justify-center"
      >
        <LivoIcon size={24} name="close" color={colors['Grey-950']} />
      </button>
    </div>
  );
};
