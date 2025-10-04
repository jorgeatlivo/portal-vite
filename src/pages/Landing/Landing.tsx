import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { Typography } from '@mui/material';
import clsx from 'clsx';

import { markdown } from '@/utils/markdown';

import PartnersSection from '@/pages/Landing/PartnersSection';
import styles from './landing.module.scss';

export default function Landing() {
  const { t } = useTranslation('sign-in');
  return (
    <div
      className={clsx(
        'relative flex flex-col items-center bg-Secondary-900 xxs:!h-auto xxs:pt-12 md:min-h-screen md:flex-1 md:justify-between md:overflow-hidden md:pt-16',
        styles.landing_background
      )}
    >
      <div
        className={
          'flex w-full flex-col items-center xxs:justify-start md:flex-1 md:justify-evenly'
        }
      >
        {/* Main Content */}
        <div className="content-wrapper lg:px-15 flex w-full max-w-[1420px] flex-col space-y-8 px-4 xxs:mt-10 xxs:justify-start sm:items-center md:mt-0 md:flex-row md:justify-between md:space-y-0 md:px-6">
          {/* Left Content */}
          <div className="left-content space-y-20 text-white xxs:space-y-5 md:mr-2">
            <Typography
              variant="h1"
              component="h1"
              className={
                'max-w-2xl !font-telegraf !leading-r02 xxs:!text-f07 sm:!text-f08 md:max-w-lg md:!text-f09 lg:max-w-2xl lg:!text-f10 xl:!text-f11'
              }
            >
              {t('landing_headline')}
            </Typography>
            <Typography
              variant="body1"
              className={
                'max-w-2xl !font-telegraf !leading-r02 sm:!text-f06 md:max-w-lg lg:max-w-2xl lg:!text-f06 xl:!text-f08'
              }
            >
              {markdown(t('landing_sub_headline'))}
            </Typography>
          </div>

          {/* Login or Register Form */}
          <div className="pt-4 md:pt-0">
            <Outlet />
          </div>
        </div>
      </div>
      <PartnersSection />
    </div>
  );
}
