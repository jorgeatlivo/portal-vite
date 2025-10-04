import React, { createContext, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { usePostHog } from 'posthog-js/react';

import { translate } from '@/services/i18next/translate';
import { Logger } from '@/services/logger.service';
import { showToastAction } from '@/store/actions/appConfigurationActions';
import { OFFER_DETAIL_QUERY_ID } from '@/queries/offer-detail';

import { useInvalidateQuery } from '@/hooks/use-invalidate-query';
import { OfferDetail } from '@/types/offers';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import { useCloseOffer } from '@/pages/OfferDetail/hooks/useMutationOffer';
import { RouteBreadcrumbs } from '@/routers/config';

interface OfferActionsContextType {
  handleEdit: () => void;
  handleDuplicateOffer: (offer: OfferDetail) => void;
  handleCloseOffer: (
    offerId: number
  ) => Promise<{ ok: boolean; offerId: number } | undefined>;
  handleCancelEdit: () => void;
  handleSuccessEdit: (offerId: number) => void;
  isEditing: boolean;
}

const OfferActionsContext = createContext<OfferActionsContextType | undefined>(
  undefined
);

export const OfferActionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation('offers');
  const posthog = usePostHog();
  const { state } = useLocation();
  const [isEditing, setIsEditing] = useState(state?.action === 'edit');
  const invalidateQuery = useInvalidateQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleUncaughtError } = useUncaughtErrorHandler();
  const onCompletedAction = (params?: { ok: boolean; offerId: number }) => {
    invalidateQuery([OFFER_DETAIL_QUERY_ID, `${params?.offerId}`]);
    dispatch(
      showToastAction({
        message: translate('offers:toast_offer_cancelled', {
          offerId: params?.offerId,
        }),
        severity: 'success',
      })
    );
  };

  const { closeOfferAsync: closeOffer } = useCloseOffer({
    onSuccess: onCompletedAction,
    onError: (error) => {
      handleUncaughtError(error, t('error_toast_offer_cancelled'));
      Logger.error('Error on close offer', error);
    },
  });

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    posthog.capture('discard_changes');
    setIsEditing(false);
  }, [posthog]);

  const handleSuccessEdit = (offerId: number) => {
    invalidateQuery([OFFER_DETAIL_QUERY_ID, `${offerId}`]);
    setIsEditing(false);
  };

  const handleDuplicateOffer = useCallback(
    (offer: OfferDetail) => {
      navigate(`/${RouteBreadcrumbs.OffersPage}?action=create-offer`, {
        state: { initialOffer: offer },
      });
    },
    [navigate]
  );

  const handleCloseOffer = useCallback(
    (offerId: number) => {
      return closeOffer(offerId);
    },
    [closeOffer]
  );

  const value = {
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleSuccessEdit,
    handleDuplicateOffer,
    handleCloseOffer,
  };

  return (
    <OfferActionsContext.Provider value={value}>
      {children}
    </OfferActionsContext.Provider>
  );
};

export const useOfferActions = () => {
  const context = useContext(OfferActionsContext);
  if (context === undefined) {
    throw new Error(
      'useOfferActions must be used within an OfferActionProvider'
    );
  }
  return context;
};
