import { useTranslation } from 'react-i18next';

export const useOfferLabels = () => {
  const { t } = useTranslation('offers');

  const getOfferTitle = (
    livoUnitLabel?: string,
    facilityTypeLabel?: string,
    professionalFieldLabel?: string
  ): string => {
    if (!livoUnitLabel && !professionalFieldLabel) return t('offer_title');

    const workplaceLabel = livoUnitLabel || facilityTypeLabel || '';
    const separator = workplaceLabel && professionalFieldLabel ? ': ' : '';

    return `${workplaceLabel}${separator}${professionalFieldLabel || ''}`;
  };

  return { getOfferTitle };
};
