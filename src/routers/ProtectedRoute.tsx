/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { matchPath, Navigate, Outlet, useLocation } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';
import { usePostHog } from 'posthog-js/react';

import { AccountInfo, VisibleTabEnum } from '@/services/account';
import { ApiApplicationError } from '@/services/api';
import { changeLanguageByLocale } from '@/services/i18next/translate';
import { setAccountInfo } from '@/store/actions/accountActions';
import { fetchActivity } from '@/store/actions/activityShiftListActions';
import {
  showToastAction,
  toggleInternetConnection,
} from '@/store/actions/appConfigurationActions';
import { setFilters } from '@/store/actions/filtersActions';
import { fetchPendingRequests } from '@/store/actions/pendingProfessionalsActions';
import { setProfessionalFilters } from '@/store/actions/professionalFiltersAction';
import { RootState } from '@/store/types';

import { Filter } from '@/types/common/shiftFilters';

import { useAuth } from '@/contexts/Authentication.context';
import { useProtectedRoutes } from '@/routers/hooks/use-protected-router';
import { AppDispatch } from '@/store';
import { useFetchAccountInfo } from './hooks/useFetchAccountInfo';

const ProtectedRoute: React.FC = memo(() => {
  const { t } = useTranslation(['facility-staff', 'shift-claim-details']);
  const location = useLocation();
  const filteredRoutes = useProtectedRoutes();
  const { token } = useAuth();

  const {
    isLoading,
    accountInfo: fetchedAccountInfo,
    error,
  } = useFetchAccountInfo(token);

  const dispatch = useDispatch<AppDispatch>();
  const posthog = usePostHog();
  const { accountInfo } = useSelector((state: RootState) => state.account);
  const isAuthenticated = !!token;

  useEffect(() => {
    if (
      accountInfo?.visibleTabMenu.includes(VisibleTabEnum.ACTIONABLE_SHIFTS)
    ) {
      dispatch(fetchActivity());
    }
    if (
      accountInfo?.visibleTabMenu.includes(
        VisibleTabEnum.INTERNAL_STAFF_MANAGEMENT
      )
    ) {
      dispatch(fetchPendingRequests());
    }
  }, [accountInfo?.visibleTabMenu]);

  const storeAccountFilters = useCallback(
    (accountInfo: AccountInfo) => {
      const units = accountInfo.units ?? [];
      const categories = accountInfo.facility.categories ?? [];

      const shiftFilters = [] as Filter[];
      const professionalFilters = [] as Filter[];
      if (units.length > 0) {
        shiftFilters.push({
          key: 'unit',
          name: t('units_label'),
          options: units,
          selectedOptions: [],
          appliedOptions: [],
        });
        professionalFilters.push({
          key: 'unit',
          name: t('units_label'),
          options: units,
          selectedOptions: [],
          appliedOptions: [],
        });
      }
      if (categories.length > 0) {
        shiftFilters.push({
          key: 'category',
          name: t('shift-claim-details:categories_label'),
          options: categories,
          selectedOptions: [],
          appliedOptions: [],
        });
        professionalFilters.push({
          key: 'category',
          name: t('shift-claim-details:categories_label'),
          options: categories,
          selectedOptions: [],
          appliedOptions: [],
        });
      }

      dispatch(setFilters(shiftFilters));
      dispatch(setProfessionalFilters(professionalFilters));
    },
    [dispatch]
  );

  /**
   * Fetch account info and store it in the store
   */
  useEffect(() => {
    if (fetchedAccountInfo) {
      const { locale } = fetchedAccountInfo;
      changeLanguageByLocale(locale);
      dispatch(setAccountInfo(fetchedAccountInfo));
      storeAccountFilters(fetchedAccountInfo);
      posthog.identify(fetchedAccountInfo.id.toString(), {
        email: fetchedAccountInfo.email,
        name: `${fetchedAccountInfo.firstName} ${fetchedAccountInfo.lastName}`,
      });
    }
  }, [dispatch, storeAccountFilters, fetchedAccountInfo]);

  useEffect(() => {
    if (error) {
      if (error instanceof ApiApplicationError) {
        if (error.cause === 'NO_INTERNET') {
          dispatch(toggleInternetConnection(false));
        } else {
          dispatch(
            showToastAction({
              message: error.message,
              severity: 'error',
            })
          );
        }
      }
    }
  }, [dispatch, error, showToastAction, toggleInternetConnection]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          minHeight: '30em',
          minWidth: '100%',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated && filteredRoutes.length > 0) {
    /**
     * if location not included in filteredRoutes
     * then navigate user to the first route
     */
    if (
      !filteredRoutes.some((route) => {
        return matchPath(route.path, location.pathname);
      })
    ) {
      return <Navigate to={filteredRoutes[0].path} replace />;
    }

    return <Outlet />;
  }

  return null;
});

export default ProtectedRoute;
