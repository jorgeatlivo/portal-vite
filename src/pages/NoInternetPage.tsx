// NoInternetPage.jsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

const NoInternetPage = () => {
  const { t } = useTranslation('no-internet');

  const { internetConnection } = useSelector(
    (state: RootState) => state.appConfiguration
  );

  useEffect(() => {
    if (internetConnection) {
      window.location.reload();
    }
  }, [internetConnection]);

  return (
    <div className="content flex w-full flex-col items-center justify-center p-large text-center">
      <LivoIcon name="cloud-off" size={64} color={colors['Grey-700']} />
      <p className="heading-md mb-small text-Text-Default">
        {t('no_internet_title')}
      </p>
      <p className="body-regular text-Text-Default">
        {t('no_internet_message')}
      </p>
    </div>
  );
};

export default NoInternetPage;
