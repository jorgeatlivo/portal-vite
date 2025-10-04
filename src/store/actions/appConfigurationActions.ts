import { Toast } from '@/store/types';

export const showToastAction = (toast: Toast | null) => {
  return {
    type: 'SHOW_TOAST',
    payload: toast,
  };
};

export const hideToastAction = () => {
  return {
    type: 'HIDE_TOAST',
  };
};

export const toggleInternetConnection = (internetConnection: boolean) => {
  return {
    type: 'TOGGLE_INTERNET_CONNECTION',
    payload: internetConnection,
  };
};
