import { AccountInfo } from '@/services/account';

export function isDenarioIntegrated(accountInfo: AccountInfo | null) {
  return (
    accountInfo?.facility.livoInternalOnboardingStrategy ===
    'DENARIO_INTEGRATED'
  );
}
