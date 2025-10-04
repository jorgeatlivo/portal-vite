import { AccountAction, AccountState } from '@/store/types';

const initialState: AccountState = {
  accountInfo: null,
};

export const accountReducer = (state = initialState, action: AccountAction) => {
  switch (action.type) {
    case 'SET_ACCOUNT_INFO':
      return {
        ...state,
        accountInfo: action.payload,
      };
    default:
      return state;
  }
};
