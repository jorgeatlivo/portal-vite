import { AccountInfo } from '@/services/account';

export const setAccountInfo = (accountInfo: AccountInfo | null) => {
  return {
    type: 'SET_ACCOUNT_INFO',
    payload: accountInfo,
  };
};
