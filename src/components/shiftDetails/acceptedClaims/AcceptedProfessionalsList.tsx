import { ClaimRequest } from '../../../types/claims';
import { EmptyCapacityClaim } from '../EmptyCapacityClaim';
import { IncreaseCapacity } from '../IncreaseCapacityItem';
import { AcceptedClaimRow } from './AcceptedClaimRow';

interface AcceptedProfessionalsListProps {
  claims: ClaimRequest[];
  selectClaim: (claim: ClaimRequest) => void;
  capacity: number;
  editable: boolean;
  onDecreaseCapacity: () => void;
  setCapacityModalOpen: (isOpen: boolean) => void;
}

export const AcceptedProfessionalsList: React.FC<
  AcceptedProfessionalsListProps
> = ({
  claims,
  selectClaim,
  capacity,
  editable,
  onDecreaseCapacity,
  setCapacityModalOpen,
}) => {
  return (
    <div className="flex flex-1 flex-col space-y-small">
      {claims.map((claim) => (
        <div
          key={claim.id}
          className="flex w-full flex-wrap items-center justify-between space-x-small"
        >
          <AcceptedClaimRow claim={claim} onClick={() => selectClaim(claim)} />
        </div>
      ))}
      {Array.from({ length: capacity - claims.length }).map((_, index) => (
        <EmptyCapacityClaim
          key={`empty-capacity-claim-${index}`}
          onClick={() => onDecreaseCapacity()}
          editable={editable && capacity + claims.length > 1}
        />
      ))}
      {editable ? (
        <IncreaseCapacity
          onClick={() => {
            setCapacityModalOpen(true);
          }}
        />
      ) : null}
    </div>
  );
};
