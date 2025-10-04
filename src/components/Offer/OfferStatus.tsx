import Chip from '@/components/common/Chip';

interface OfferStatusProps {
  displayText: string;
  color: string;
  backgroundColor: string;
}

function OfferStatus(props: OfferStatusProps) {
  return (
    <Chip
      style={{ color: props?.color, backgroundColor: props?.backgroundColor }}
      label={props?.displayText}
    />
  );
}

export default OfferStatus;
