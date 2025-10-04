import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import colors from '@/config/color-palette';
import { CommonToast } from './CommonToastComponent';

interface AppToastProps {
  style?: any;
}

export const AppToast: React.FC<AppToastProps> = ({ style }) => {
  const { toast } = useSelector((state: RootState) => state.appConfiguration);
  const dispatch = useDispatch();
  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, [dispatch]);

  return toast ? (
    toast.severity === 'success' ? (
      <CommonToast
        backgroundColor={colors['Positive-050']}
        iconColor={colors['Green-500']}
        iconName="circle-check-filled"
        message={toast.message}
        onClose={hideToast}
        style={style}
      />
    ) : (
      <CommonToast
        backgroundColor={colors['Negative-050']}
        iconColor={colors['Red-500']}
        iconName="alert-triangle-filled"
        message={toast.message}
        onClose={hideToast}
        style={style}
      />
    )
  ) : null;
};
