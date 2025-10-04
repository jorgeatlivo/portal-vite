import { useTranslation } from 'react-i18next';

import { Divider } from '@mui/material';

import { Typography } from '@/components/atoms/Typography';
import { ClaimRow } from '@/components/shiftDetails/ClaimRow';
import ClaimStatus from '@/components/shiftDetails/ClaimStatus';

import { ClaimRequest } from '@/types/claims';

interface MissedClaimsComponentProps {
  claims?: ClaimRequest[];
}

export const MissedClaimsComponent: React.FC<MissedClaimsComponentProps> = ({
  claims,
}) => {
  const { t } = useTranslation(['shift-claim-details']);

  if (!claims || claims.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full min-w-fit flex-col gap-2 px-5">
      <Divider className="h-px bg-Divider-Default" />
      <div className="flex flex-col gap-2">
        <Typography variant="heading/small">
          {t('requests_not_accepted')}
        </Typography>
        <Typography variant="body/small" className="text-Text-Subtle">
          {t('professionals_not_applied_description')}
        </Typography>
      </div>

      <div className="mt-2 flex w-full flex-1 flex-col justify-start gap-3 space-y-small">
        {claims.map((claim) => {
          return (
            <div
              key={`shift-claim-missed-${claim.id}`}
              className="relative mt-0 flex w-full flex-col gap-2 rounded-lg bg-white p-medium"
            >
              <div className="absolute right-3">
                <ClaimStatus status={claim.status} />
              </div>

              <div className="flex w-full items-center justify-between space-x-small">
                <ClaimRow claim={claim} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
