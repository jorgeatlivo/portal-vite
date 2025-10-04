import { useDispatch } from 'react-redux';

import { ApiApplicationError } from '@/services/api';
import i18n from '@/services/i18next/';
import { showToastAction } from '@/store/actions/appConfigurationActions';

/**
 * Handles unauthorized errors by showing toast notifications
 * @param error - The error to handle
 * @param dispatch - Redux dispatch function
 * @param fallbackMessage - Optional fallback message if error doesn't have a specific message
 */
export const uncaughtErrorHandler = (
  error: unknown,
  dispatch: ReturnType<typeof useDispatch>,
  fallbackMessage: string = i18n.t('common:error_unexpected_error')
) => {
  if (error instanceof ApiApplicationError) {
    dispatch(
      showToastAction({
        message: error.errorMessage || fallbackMessage,
        severity: 'error',
      })
    );
  } else {
    dispatch(
      showToastAction({
        message: fallbackMessage,
        severity: 'error',
      })
    );
  }
};

export const useUncaughtErrorHandler = () => {
  const dispatch = useDispatch();

  const handleUncaughtError = (error: unknown, fallbackMessage?: string) => {
    uncaughtErrorHandler(error, dispatch, fallbackMessage);
  };

  return { handleUncaughtError };
};
