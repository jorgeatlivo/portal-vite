import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconButton } from '@mui/material';
import clsx from 'clsx';

import { ProtectedRoutesEnum, VisibleTabEnum } from '@/services/account';

import { AppToast } from '@/components/common/toasts/AppToast';

import colors from '@/config/color-palette';
import { useAuth } from '@/contexts/Authentication.context';
import { RouteProps } from '@/routers/config';
import { useFetchAccountInfo } from '@/routers/hooks/useFetchAccountInfo';
import LivoIcon from '../common/LivoIcon';
import { AppHeaderButton } from './components/AppHeaderButton';
import { ResponsiveFacilitySwitcher } from './components/ResponsiveFacilitySwitcher';

interface Props {
  logOut: () => void;
  mainRoutes: RouteProps[];
  configRoutes: RouteProps[];
  getNotificationCount: (
    routeId: VisibleTabEnum | ProtectedRoutesEnum
  ) => number | undefined;
}

const Header: FC<Props> = ({
  logOut,
  getNotificationCount,
  mainRoutes,
  configRoutes,
}) => {
  const { t } = useTranslation('sidebar');
  const { token } = useAuth();
  const { accountInfo } = useFetchAccountInfo(token);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuHeight = window.innerHeight - 56;

  const getSelectedRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = useCallback(
    (path: string) => {
      setExpanded(false);
      navigate(path);
    },
    [navigate]
  );

  return (
    <header className="bg-white md:hidden">
      <AppToast />
      <div className="flex items-center justify-between bg-Secondary-900 px-large py-small">
        <LivoIcon name="livo-full" size={40} color={colors['Primary-450']} />

        <IconButton onClick={() => setExpanded((prev) => !prev)}>
          <LivoIcon
            name={expanded ? 'close' : 'menu'}
            size={24}
            color={colors['Neutral-050']}
          />
        </IconButton>
      </div>

      <menu
        style={{ height: expanded ? menuHeight : 0 }}
        className={clsx(
          'fixed inset-x-0 z-[999] flex origin-top flex-col justify-between overflow-hidden border-b bg-white transition-all duration-300 ease-in-out',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div>
          {mainRoutes.map((route) => (
            <AppHeaderButton
              label={t(route.name as never)}
              iconName={route.iconName!}
              isFocused={getSelectedRoute(route.path)}
              onClick={() => handleNavigation(route.path)}
              notifications={getNotificationCount(route.id)}
            />
          ))}
        </div>
        <div>
          {accountInfo?.facilityGroup ? (
            <ResponsiveFacilitySwitcher
              facilityGroup={accountInfo.facilityGroup}
              expanded={expanded}
              header
            />
          ) : null}
          {configRoutes.map((route, index) => (
            <AppHeaderButton
              key={index}
              label={t(route.name as never)}
              iconName={route?.iconName!}
              isFocused={getSelectedRoute(route.path)}
              onClick={() => handleNavigation(route.path)}
              notifications={getNotificationCount(route.id)}
            />
          ))}
          <AppHeaderButton
            label={t('leave')}
            onClick={logOut}
            iconName={'log-out'}
            isFocused={false}
          />
        </div>
      </menu>
    </header>
  );
};

export default Header;
