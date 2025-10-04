import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { UserFeatureEnum } from '@/services/account';
import { selectUserFeatures } from '@/store/selectors/account.selector';

export function useIsFeatureEnable(feature: UserFeatureEnum) {
  const features = useSelector(selectUserFeatures);

  const isEnabled = useMemo(() => {
    return features.includes(feature);
  }, [feature, features]);

  return isEnabled;
}
