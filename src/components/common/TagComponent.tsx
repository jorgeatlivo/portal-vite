interface TagComponentProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  children?: any;
  className?: string;
  labelClassName?: string;
  style?: any;
}

export const TagComponent: React.FC<TagComponentProps> = ({
  label,
  isSelected,
  onClick,
  children,
  className,
  labelClassName,
  style,
}) => {
  const checkStyle = isSelected
    ? 'bg-Secondary-900 ring-Secondary-900 text-white'
    : 'bg-white hover:bg-Neutral-050 ring-Neutral-400 text-Mint-600';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={
        className ??
        `flex items-center rounded-[100px] px-medium py-small ring-1 transition-colors duration-300 ease-in-out ${checkStyle}`
      }
      style={style}
    >
      <p className={labelClassName ?? 'action-sm'}>{label}</p>
      {children}
    </button>
  );
};
