import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { useNestedPage } from '@/hooks/use-nested-page';

import OfferCreateForm from '@/pages/OfferDetail/OfferCreationPage/OfferCreationForm';
import { ReturnButtonHeader } from '@/pages/shared/ShiftForm/components/ReturnButtonHeader';

const OfferCreation = () => {
  const { t } = useTranslation('offers');
  const { isOpenPage, isVisible, goBack } = useNestedPage('create-offer');

  if (!isOpenPage) {
    return null;
  }

  return (
    <div
      className={clsx(
        'absolute inset-0 mx-large flex flex-col items-center overflow-hidden bg-BG-Default transition-transform duration-300',
        isVisible ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <ReturnButtonHeader goBack={goBack} title={t('create_offer_button')} />
      <div className="flex w-full flex-1 overflow-auto overflow-x-hidden">
        <OfferCreateForm />
      </div>
    </div>
  );
};

export default OfferCreation;
