import { AppConfigurationAction } from '@/store/types';

const initialState = {
  toast: null,
  internetConnection: true,
};

export const appConfigurationReducer = (
  state = initialState,
  action: AppConfigurationAction
) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: action.payload,
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: null,
      };
    case 'TOGGLE_INTERNET_CONNECTION':
      return {
        ...state,
        internetConnection: action.payload,
      };
    default:
      return state;
  }
};
