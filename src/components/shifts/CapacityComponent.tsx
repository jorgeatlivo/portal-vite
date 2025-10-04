import React from 'react';

import ClaimStatusIcon from '@/components/shiftDetails/ClaimStatus';

import { ClaimStatus } from '@/types/claims';

import colors from '@/config/color-palette';
import LivoIcon from '../common/LivoIcon';

interface CapacityComponentProps {
  acceptedClaims: number;
  totalAcceptedClaimsWithoutHRIntegration?: number;
  totalPendingInvitationClaims?: number;
  emptyClaims: number;
}

export const CapacityComponent: React.FC<CapacityComponentProps> = ({
  acceptedClaims,
  totalAcceptedClaimsWithoutHRIntegration,
  totalPendingInvitationClaims,
  emptyClaims,
}) => {
  return (
    <div className="flex">
      {Array.from(
        {
          length:
            acceptedClaims - (totalAcceptedClaimsWithoutHRIntegration || 0),
        },
        (_, i) => i + 1
      ).map((_, index) => (
        <LivoIcon
          size={20}
          key={`accepted-${index}`}
          name="user-check"
          color={colors['Positive-500']}
        />
      ))}
      {Array.from(
        { length: totalAcceptedClaimsWithoutHRIntegration || 0 },
        (_, i) => i + 1
      ).map((_, index) => (
        <LivoIcon
          size={20}
          key={`hr-integration-${index}`}
          name="user-check"
          color={colors['Warning-400']}
        />
      ))}

      {Array.from(
        { length: totalPendingInvitationClaims || 0 },
        (_, i) => i + 1
      ).map((_, index) => (
        <ClaimStatusIcon
          key={`hr-pending-invitation-${index}`}
          status={ClaimStatus.PENDING_PRO_ACCEPT}
          className="size-5"
        />
      ))}

      {Array.from({ length: emptyClaims }, (_, i) => i + 1).map((_, index) => (
        <LivoIcon
          size={20}
          key={`empty-${index}`}
          name="user"
          color={colors['Grey-400']}
        />
      ))}
    </div>
  );
};
