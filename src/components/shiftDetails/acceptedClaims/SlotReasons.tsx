import { ClaimRequest } from '../../../types/claims';
import { SlotReasonComponent } from './SlotReasonComponent';

interface SlotReasonsProps {
  claims: ClaimRequest[];
  onPress: (claim: ClaimRequest) => void;
}

export const SlotReasons: React.FC<SlotReasonsProps> = ({
  claims,
  onPress,
}) => {
  return (
    <div className="w-full space-y-large p-medium">
      {claims.map((claim, index) => (
        <SlotReasonComponent
          key={index}
          reason={claim.slotReason}
          professionalName={
            claim.professionalProfile.firstName +
            ' ' +
            claim.professionalProfile.lastName
          }
          onPress={() => onPress(claim)}
        />
      ))}
    </div>
  );
};
