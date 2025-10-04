// src/Sidebar.js
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import { ProtectedRoutesEnum, VisibleTabEnum } from '@/services/account';

import LivoIcon from '@/components/common/LivoIcon';
import { SideBarButton } from '@/components/layout/components/SideBarButton';

import { usePersistBooleanInLocalStorage } from '@/hooks/use-persist-boolean-in-local-storage';

import colors from '@/config/color-palette';
import { useAuth } from '@/contexts/Authentication.context';
import { RouteProps } from '@/routers/config';
import { useFetchAccountInfo } from '@/routers/hooks/useFetchAccountInfo';
import { ResponsiveFacilitySwitcher } from './components/ResponsiveFacilitySwitcher';

interface SidebarProps {
  logOut: () => void;
  mainRoutes: RouteProps[];
  configRoutes: RouteProps[];
  getNotificationCount: (
    routeId: VisibleTabEnum | ProtectedRoutesEnum
  ) => number | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({
  logOut,
  getNotificationCount,
  mainRoutes,
  configRoutes,
}) => {
  const { t } = useTranslation('sidebar');
  const location = useLocation();
  const navigate = useNavigate();

  const { storedValue: expanded, setStoredValue: setExpanded } =
    usePersistBooleanInLocalStorage('sidebarExpanded', false);

  const { token } = useAuth();
  const { accountInfo } = useFetchAccountInfo(token);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expandedAutomatically = useRef<boolean>(false);

  const [isHovered, setIsHovered] = useState(false);

  const onHoverSidebar = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);

    if (!expanded) {
      timeoutRef.current = setTimeout(() => {
        expandedAutomatically.current = true;
        setExpanded(true);
      }, 3000);
    }
  };

  const onStopHoveringSidebar = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      if (expandedAutomatically.current) {
        expandedAutomatically.current = false;
        setExpanded(false);
      }
    }, 1000);
  };

  const toggleSidebar = () => {
    expandedAutomatically.current = false;
    setExpanded((prev) => !prev);
  };

  const getSelectedRoute = (path: string) => {
    return location.pathname === path;
  };

  const onClickSidebarButton = (path: string) => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    navigate(path);
  };

  return (
    <div
      onMouseEnter={onHoverSidebar}
      onMouseLeave={onStopHoveringSidebar}
      className={clsx(
        'relative z-10 hidden h-full flex-col justify-start border-Divider-Subtle bg-Secondary-900 py-[20px] transition-all duration-300 ease-in-out md:flex',
        expanded ? 'w-[240px]' : 'w-[72px]'
      )}
    >
      <button
        onClick={toggleSidebar}
        className={clsx(
          `absolute -right-large top-[25px] rounded-full bg-Primary-450 p-1 transition-all duration-300 ease-in-out`,
          isHovered
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-3 opacity-0'
        )}
      >
        <LivoIcon
          size={24}
          name={expanded ? 'arrow-left' : 'arrow-right'}
          color={colors['Secondary-900']}
        />
      </button>

      <div className="flex flex-1 flex-col overflow-hidden px-medium">
        <div className="flex flex-1 flex-col">
          <div className={'mb-[48px]'}>
            <LivoIcon
              name={expanded ? 'livo-full' : 'livo'}
              size={40}
              color={colors['Primary-450']}
            />
          </div>

          <div className={'flex flex-col gap-large'}>
            {mainRoutes.map((route, index) => (
              <SideBarButton
                key={index}
                expanded={expanded}
                iconName={route?.iconName!}
                label={t(route.name as never)}
                isFocused={getSelectedRoute(route.path)}
                notifications={getNotificationCount(route.id)}
                onClick={() => onClickSidebarButton(route.path)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className={'w-full'}>
            <div className={'flex flex-col gap-large'}>
              {accountInfo?.facilityGroup ? (
                <ResponsiveFacilitySwitcher
                  facilityGroup={accountInfo.facilityGroup}
                  expanded={expanded}
                />
              ) : null}
              {configRoutes.map((route, index) => (
                <SideBarButton
                  key={index}
                  expanded={expanded}
                  onClick={() => onClickSidebarButton(route.path)}
                  label={t(route.name as never)}
                  iconName={route?.iconName!}
                  isFocused={getSelectedRoute(route.path)}
                  notifications={getNotificationCount(route.id)}
                />
              ))}
              <SideBarButton
                label={t('leave')}
                expanded={expanded}
                onClick={logOut}
                iconName={'log-out'}
                isFocused={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
