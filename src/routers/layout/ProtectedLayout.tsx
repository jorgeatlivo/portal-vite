import { useCallback, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import FlagsService from '@/services/flags.service';

import WelcomeModal from '@/components/common/modal/WelcomeModal';
import { AppToast } from '@/components/common/toasts/AppToast';
import Header from '@/components/layout/Header';
import { useNavigationRoutes } from '@/components/layout/hooks/use-navigation-routes';
import Sidebar from '@/components/layout/Sidebar';
import OfferBanner from '@/components/OfferBanner';

import { useFlag } from '@/hooks/use-flag';
import { useModal } from '@/hooks/use-modal';
import { checkBannerDisplay } from '@/utils/bannerUtils';

import { FLAGS } from '@/config/flag-enums';
import { RouteBreadcrumbs } from '@/routers/config';

interface ProtectedLayoutProps {
  logOut: () => void;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ logOut }) => {
  const firstLoginFlag = useFlag(FLAGS.WELCOME_FIRST_LOGIN);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const openRef = useRef(false);

  const { getNotificationCount, mainRoutes, configRoutes } =
    useNavigationRoutes();

  const handleLogout = useCallback(() => {
    logOut();
    requestAnimationFrame(() => {
      navigate('/');
    });
  }, [logOut, navigate]);

  useEffect(() => {
    if (firstLoginFlag && !openRef.current) {
      openRef.current = true;
      // Remove flag
      FlagsService.removeFlag(FLAGS.WELCOME_FIRST_LOGIN);
      // Show welcome modal
      const modalContent = (
        <WelcomeModal
          onConfirm={() => {
            navigate(`/${RouteBreadcrumbs.OffersPage}?action=create-offer`);
          }}
        />
      );
      openModal(modalContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoginFlag]);

  useEffect(() => {
    checkBannerDisplay();
  }, []);

  return (
    <div className={'flex !h-screen flex-col'}>
      <Header
        logOut={handleLogout}
        getNotificationCount={getNotificationCount}
        mainRoutes={mainRoutes}
        configRoutes={configRoutes}
      />
      <AppToast />
      <OfferBanner />
      <div className="no-scrollbar flex h-full grow overflow-y-hidden">
        <Sidebar
          logOut={handleLogout}
          getNotificationCount={getNotificationCount}
          mainRoutes={mainRoutes}
          configRoutes={configRoutes}
        />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
