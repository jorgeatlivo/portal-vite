import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProtectedRoutesEnum, VisibleTabEnum } from '@/services/account';
import { fetchActivity } from '@/store/actions/activityShiftListActions';
import { fetchPendingRequests } from '@/store/actions/pendingProfessionalsActions';
import { RootState } from '@/store/types';

import { RouteProps } from '@/routers/config';
import { useProtectedRoutes } from '@/routers/hooks/use-protected-router';
import { AppDispatch } from '@/store';
import { useFeatureNotifications } from './use-fetch-feature-notifications';

export const useNavigationRoutes = () => {
  const routes = useProtectedRoutes().filter((route) => !!route.iconName);

  const dispatch = useDispatch<AppDispatch>();
  const { newOfferClaims } = useFeatureNotifications();

  const activityShiftList = useSelector(
    (state: RootState) => state.activityShiftList
  );
  const pendingRequests = useSelector(
    (state: RootState) => state.pendingRequests
  );

  const getNotificationCount = (
    routeId: VisibleTabEnum | ProtectedRoutesEnum
  ) => {
    if (routeId in VisibleTabEnum) {
      switch (routeId) {
        case VisibleTabEnum.ACTIONABLE_SHIFTS:
          return activityShiftList.shifts.length;
        case VisibleTabEnum.OFFER_MANAGEMENT:
          return newOfferClaims > 0 ? newOfferClaims : undefined;
        case VisibleTabEnum.INTERNAL_STAFF_MANAGEMENT:
          return pendingRequests.count;
        default:
          return undefined;
      }
    }

    return undefined;
  };

  useEffect(() => {
    //poll for activity notification badge, in case we need any other we might migrate this to a polling api
    if (
      routes.some(
        (route) =>
          route.id === VisibleTabEnum.ACTIONABLE_SHIFTS ||
          route.id === VisibleTabEnum.INTERNAL_STAFF_MANAGEMENT
      )
    ) {
      const interval = setInterval(() => {
        if (
          routes.some((route) => route.id === VisibleTabEnum.ACTIONABLE_SHIFTS)
        ) {
          dispatch(fetchActivity());
        }

        if (
          routes.some(
            (route) => route.id === VisibleTabEnum.INTERNAL_STAFF_MANAGEMENT
          )
        ) {
          dispatch(fetchPendingRequests());
        }
      }, 60000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [routes, dispatch]);

  const { mainRoutes, configRoutes } = useMemo(
    () =>
      routes.reduce<{
        mainRoutes: RouteProps[];
        configRoutes: RouteProps[];
      }>(
        (acc, route) => {
          route.configRoute
            ? acc.configRoutes.push(route)
            : acc.mainRoutes.push(route);

          return acc;
        },
        { mainRoutes: [], configRoutes: [] }
      ),
    [routes]
  );

  return {
    getNotificationCount,
    mainRoutes,
    configRoutes,
  };
};
