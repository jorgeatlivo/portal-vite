import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { FormConfig } from '@/queries/offer-mutation';

import { OfferDetail } from '@/types/offers';

import { OfferFormData } from '@/pages/OfferDetail/offer-form.config';
import { buildDetailToFormValue } from '@/pages/OfferDetail/utils';

export const useDefaultValues = (config?: FormConfig) => {
  const location = useLocation();
  const offer: OfferDetail | undefined = useMemo(
    () => location.state?.initialOffer,
    [location.state?.initialOffer]
  );

  const defaultFormValue: OfferFormData = useMemo(() => {
    return buildDetailToFormValue(offer, config);
  }, [config, offer]);

  return {
    defaultFormValue,
  };
};
