import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePostHog } from 'posthog-js/react';

import { Logger } from '@/services/logger.service';
import { RootState } from '@/store/types';
import { OFFER_LIST_QUERY_KEY } from '@/queries/offer-list';

import LoadingView from '@/components/common/LoadingView';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import useHandlePublishFailed from '@/hooks/offers/use-handle-publish-failed';
import { useInvalidateQuery } from '@/hooks/use-invalidate-query';
import { useModal } from '@/hooks/use-modal';
import { SubscriptionStatus } from '@/types/offers';
import { preventEnterKeySubmit } from '@/utils/form';

import colors from '@/config/color-palette';
import OfferCoreForm from '@/pages/OfferDetail/components/OfferCoreForm';
import { useDefaultValues } from '@/pages/OfferDetail/hooks/useDefaultValues';
import useFetchOfferConfig from '@/pages/OfferDetail/hooks/useFetchOffersConfig';
import {
  buildOfferPayload,
  useSaveDraftOffer,
} from '@/pages/OfferDetail/hooks/useMutationOffer';
import OfferPreviewModal, {
  OFFER_PREVIEW_MODAL_CLASSES,
} from '@/pages/OfferDetail/modals/OfferPreviewModal';
import OfferCategoryForm from '@/pages/OfferDetail/OfferCreationPage/OfferCategoryForm';
import {
  OfferFormData,
  offerFormSchema,
} from '@/pages/OfferDetail/offer-form.config';
import { RouteBreadcrumbs } from '@/routers/config';
import { useModalBeforeChangingAccountInfo } from '../hooks/useModalBeforeChangingAccountInfo';
import { LosingChangesWarningModal } from '../modals/OfferLosingChangesWarningModal';
import { TabValues } from '../OfferDetailPage/OfferDetailPage';

const OfferCreationForm = () => {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const { t } = useTranslation('offers');
  const { openModal } = useModal();
  const invalidateQuery = useInvalidateQuery();
  const onPublishFailed = useHandlePublishFailed();

  const accountInfo = useSelector(
    (state: RootState) => state.account.accountInfo
  );

  const { config, isConfigFetched } = useFetchOfferConfig();
  const { defaultFormValue } = useDefaultValues(config);

  const [submitMode, setSubmitMode] = useState<SubmitActionType | undefined>();

  useModalBeforeChangingAccountInfo((confirmChange, cancelChange) => (
    <LosingChangesWarningModal
      close={cancelChange}
      cancel={confirmChange}
      confirm={cancelChange}
    />
  ));
  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema(!!config?.units.length)),
    defaultValues: defaultFormValue,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { saveDraftOffer, isPending: isPendingSave } = useSaveDraftOffer();

  const onSubmit: SubmitHandler<OfferFormData> = useCallback(
    async (data, event) => {
      try {
        const submitEvent = event?.nativeEvent as SubmitEvent;
        const { value: typeSubmit } =
          submitEvent?.submitter as HTMLButtonElement;

        setSubmitMode(typeSubmit as SubmitActionType);

        const facilityId = accountInfo?.facilityGroup?.facilities.find(
          (facility) => facility.selected
        )?.id;

        const payload = buildOfferPayload(data, facilityId);
        const response = await saveDraftOffer(payload);
        const { details: offerDetails, subscription } = response ?? {};

        /**
         * if the action is save, we just navigate to the list of offers
         */
        if (typeSubmit === SUBMIT_ACTION.Save) {
          posthog.capture('save_offer_cta');
          invalidateQuery(OFFER_LIST_QUERY_KEY);
          offerDetails?.id && navigate(`/${RouteBreadcrumbs.OffersPage}`);
          return;
        }

        posthog.capture('create_offer_cta');
        offerDetails?.id &&
          navigate(
            `/${RouteBreadcrumbs.OffersPage}?offerId=${offerDetails.id}&tab=${TabValues.DETAILS}`,
            { state: { action: 'edit' } }
          );

        /**
         * invalid query because draft created
         */
        invalidateQuery(OFFER_LIST_QUERY_KEY);

        /**
         * if action is publish
         * we need to show a dialog with the status of the subscription
         */
        if (subscription?.status === SubscriptionStatus.SLOT_AVAILABLE) {
          if (!offerDetails) {
            return;
          }
          const content = (
            <OfferPreviewModal
              subscription={subscription}
              offer={offerDetails}
              onPublishSuccess={(response) => {
                /**
                 * invalid query because offer published
                 */
                invalidateQuery(OFFER_LIST_QUERY_KEY);
                response?.offerId &&
                  navigate(`/${RouteBreadcrumbs.OffersPage}`);
              }}
            />
          );

          return openModal(content, {
            className: OFFER_PREVIEW_MODAL_CLASSES,
          });
        }
        /**
         * if status is not slot available, we show a dialog with the status
         */
        onPublishFailed(subscription);
      } catch (error) {
        Logger.error('Error saving offer', error);
      } finally {
        setSubmitMode(undefined);
      }
    },
    [
      accountInfo?.facilityGroup,
      invalidateQuery,
      navigate,
      onPublishFailed,
      openModal,
      posthog,
      saveDraftOffer,
    ]
  );

  if (!isConfigFetched) {
    return (
      <div className="relative flex size-full flex-1">
        <LoadingView />
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      // prevent submit on enter key press in input fields
      onKeyDown={preventEnterKeySubmit}
      className={
        'relative flex size-full flex-1 flex-col-reverse justify-center gap-5 md:flex-row'
      }
    >
      <div
        className={
          'no-scrollbar mb-6 flex w-full max-w-3xl flex-col gap-3 overflow-auto rounded-lg bg-white p-6 pb-12 shadow-md md:my-6'
        }
      >
        <OfferCategoryForm form={form} config={config} />
        <OfferCoreForm form={form} config={config} />
      </div>
      {/* Fixed buttons container */}
      <div className="flex min-w-48 justify-center gap-4 md:w-fit md:flex-col md:justify-start md:pt-6">
        <MaterialActionButton
          variant="contained"
          type="submit"
          value={SUBMIT_ACTION.Publish}
          tint={colors['Primary-500']}
          isLoading={submitMode === 'publish' && isPendingSave}
          isDisabled={isSubmitting}
        >
          {t('publish')}
        </MaterialActionButton>
        <MaterialActionButton
          variant="outlined"
          tint={colors['Primary-500']}
          type="submit"
          value={SUBMIT_ACTION.Save}
          isLoading={submitMode === 'save' && isPendingSave}
          isDisabled={isSubmitting}
        >
          {t('save_draft')}
        </MaterialActionButton>
      </div>
    </form>
  );
};

const SUBMIT_ACTION = {
  Save: 'save',
  Publish: 'publish',
};

type SubmitActionType = 'save' | 'publish';

export default OfferCreationForm;
