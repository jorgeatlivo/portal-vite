import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { usePostHog } from 'posthog-js/react';

import {
  BANNER_STATUS_KEY,
  BannerStatus,
  DISPLAY_OFFER_BANNER_KEY,
  getBannerDisplayState,
  PREVIOUS_BANNER_STATUS_KEY,
} from '@/utils/bannerUtils';

import bannerBg from '@/assets/banner.svg';
import { RouteBreadcrumbs } from '@/routers/config';
import LivoIcon from './common/LivoIcon';

const OfferBanner: React.FC = () => {
  const { t } = useTranslation('banner');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [displayOfferTopBanner, setDisplayOfferTopBanner] = useState(
    getBannerDisplayState(DISPLAY_OFFER_BANNER_KEY)
  );
  const [bannerStatus, setBannerStatus] = useState<BannerStatus>(
    (localStorage.getItem(BANNER_STATUS_KEY) as BannerStatus) ||
      BannerStatus.OPENED
  );

  const updateBannerStatus = (status: BannerStatus) => {
    if (
      status === BannerStatus.CLOSED &&
      bannerStatus !== BannerStatus.CLOSED
    ) {
      localStorage.setItem(PREVIOUS_BANNER_STATUS_KEY, bannerStatus);
    }

    setBannerStatus(status);
    localStorage.setItem(BANNER_STATUS_KEY, status);
  };

  useEffect(() => {
    const checkDisplayState = () =>
      setDisplayOfferTopBanner(getBannerDisplayState(DISPLAY_OFFER_BANNER_KEY));
    window.addEventListener('storage', checkDisplayState);
    checkDisplayState();
    return () => window.removeEventListener('storage', checkDisplayState);
  }, []);

  useEffect(() => {
    if (
      !displayOfferTopBanner ||
      [`/${RouteBreadcrumbs.OffersPage}`, '/'].includes(pathname)
    ) {
      updateBannerStatus(BannerStatus.CLOSED);
      return;
    }

    const currentStatus = localStorage.getItem(
      BANNER_STATUS_KEY
    ) as BannerStatus;

    if (currentStatus === BannerStatus.CLOSED || !currentStatus) {
      const previousStatus = localStorage.getItem(
        PREVIOUS_BANNER_STATUS_KEY
      ) as BannerStatus;
      updateBannerStatus(
        previousStatus === BannerStatus.MINIMIZED
          ? BannerStatus.MINIMIZED
          : BannerStatus.OPENED
      );
    } else {
      updateBannerStatus(currentStatus);
    }
  }, [displayOfferTopBanner, pathname]);

  const handleNavigateToOffers = () => {
    posthog.capture('banner_click', {
      status: bannerStatus,
      from_page: pathname,
    });
    navigate(`/${RouteBreadcrumbs.OffersPage}`);
  };

  const handleMinimizeBanner = () => {
    posthog.capture('banner_minimize', { from_page: pathname });
    updateBannerStatus(BannerStatus.MINIMIZED);
  };

  if (bannerStatus === BannerStatus.CLOSED) return null;

  const isOpened = bannerStatus === BannerStatus.OPENED;

  return (
    <div className="inset-x-0 top-16">
      <section
        className={`flex items-center justify-center bg-Mint-900 bg-cover px-6 text-white ${
          isOpened ? 'h-20' : 'h-14'
        }`}
        style={{
          backgroundImage: `url(${bannerBg})`,
          backgroundPosition: 'bottom',
        }}
      >
        {isOpened ? (
          <>
            <div className="flex items-center gap-6 text-center">
              <div className="text-left">
                <p className="text-lg font-bold">{t('title_text')}</p>
                <p className="text-sm">{t('subtitle_text')}</p>
              </div>
              <button
                type="button"
                className="rounded-full bg-Mint-200 px-8 py-3 font-medium text-Mint-900"
                onClick={handleNavigateToOffers}
              >
                {t('action_button_text')}
              </button>
            </div>
            <button
              type="button"
              className="absolute right-6"
              onClick={handleMinimizeBanner}
            >
              <LivoIcon name="close" size={24} color="#FFF" />
            </button>
          </>
        ) : (
          <p
            className="cursor-pointer text-lg font-bold underline"
            onClick={handleNavigateToOffers}
          >
            {t('title_text')}
          </p>
        )}
      </section>
    </div>
  );
};

export default OfferBanner;
