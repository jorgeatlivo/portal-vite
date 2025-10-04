interface OfferClaimButtonProps {
  label: string;
  color: string;
  backgroundColor: string;
  onClick: () => void;
}

export const OfferClaimButton: React.FC<OfferClaimButtonProps> = ({
  label,
  color,
  backgroundColor,
  onClick,
}) => {
  return (
    <button
      type="button"
      style={{ backgroundColor }}
      className="flex items-center justify-start gap-1 rounded px-3 py-2"
      onClick={onClick}
    >
      <div
        style={{ color }}
        className="font-medium text-base leading-none tracking-tight"
      >
        {label}
      </div>
    </button>
  );
};
