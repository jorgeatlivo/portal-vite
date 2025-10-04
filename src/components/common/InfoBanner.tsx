import LivoIcon from '@/components/common/LivoIcon';

interface DisclaimerProps {
  message: string;
  severity: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  message,
  severity,
}) => {
  return (
    <div className="inline-flex h-6 items-center justify-start gap-1 rounded bg-Neutral-050 px-2 py-1 pb-2">
      {severity === 'WARNING' && (
        <LivoIcon name="alert-triangle" size={16} color="#FF0000" />
      )}
      <div className="font-['Roboto'] text-xs font-normal leading-none text-Neutral-950">
        {message}
      </div>
    </div>
  );
};
