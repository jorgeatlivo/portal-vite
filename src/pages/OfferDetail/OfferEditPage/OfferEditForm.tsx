import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { usePostHog } from 'posthog-js/react';

import { ApiApplicationError } from '@/services/api';
import { Logger } from '@/services/logger.service';

import LoadingView from '@/components/common/LoadingView';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import useHandlePublishFailed from '@/hooks/offers/use-handle-publish-failed';
import { OfferStatus, OfferSubscription } from '@/types/offers';
import { preventEnterKeySubmit } from '@/utils/form';

import colors from '@/config/color-palette';
import OfferCoreForm from '@/pages/OfferDetail/components/OfferCoreForm';
import OfferInfoHeader from '@/pages/OfferDetail/components/OfferInfoHeader';
import { useOfferActions } from '@/pages/OfferDetail/contexts/OfferActionsContext';
import { useOfferDetail } from '@/pages/OfferDetail/contexts/OfferDetailContext';
import useFetchOfferConfig from '@/pages/OfferDetail/hooks/useFetchOffersConfig';
import {
  buildOfferPayload,
  useEditOffer,
  usePublishOffer,
} from '@/pages/OfferDetail/hooks/useMutationOffer';
import {
  OfferFormData,
  offerFormSchema,
} from '@/pages/OfferDetail/offer-form.config';
import { buildDetailToFormValue } from '@/pages/OfferDetail/utils';
import { useModalBeforeChangingAccountInfo } from '../hooks/useModalBeforeChangingAccountInfo';
import { LosingChangesWarningModal } from '../modals/OfferLosingChangesWarningModal';

const OfferEditForm = () => {
  const posthog = usePostHog();
  const { t } = useTranslation('offers');
  const { offerId, offer } = useOfferDetail();
  const [submitMode, setSubmitMode] = useState<SubmitActionType | undefined>();
  const { config, isConfigFetched } = useFetchOfferConfig();
  const { handleCancelEdit, handleSuccessEdit } = useOfferActions();
  const { editOfferAsync: editOffer } = useEditOffer();
  const { publishOfferAsync: publishOffer } = usePublishOffer();
  const onPublishFailed = useHandlePublishFailed();

  useModalBeforeChangingAccountInfo((confirmChange, cancelChange) => (
    <LosingChangesWarningModal
      close={cancelChange}
      cancel={confirmChange}
      confirm={cancelChange}
      edit
    />
  ));

  const formOfferDefaultValue = useMemo(() => {
    return buildDetailToFormValue(offer, config, true);
  }, [config, offer]);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerFormSchema(!!config?.units.length)),
    defaultValues: formOfferDefaultValue,
  });

  /**
   * reset form when config is fetched
   * to update the form default values
   */
  useEffect(() => {
    if (isConfigFetched) {
      form.reset(formOfferDefaultValue);
    }
  }, [form, formOfferDefaultValue, isConfigFetched]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<OfferFormData> = useCallback(
    async (data, event) => {
      // Prevent form submission if offerId is not available
      if (!offerId) {
        return;
      }

      const _offerId = Number.parseInt(offerId);

      try {
        const submitEvent = event?.nativeEvent as SubmitEvent;
        const { value: typeSubmit } =
          submitEvent?.submitter as HTMLButtonElement;

        setSubmitMode(typeSubmit as SubmitActionType);

        const {
          category: _category,
          professionalField: _professionalField,
          ...payload
        } = buildOfferPayload(data);

        /**
         * Edit offer
         */
        const editResult = await editOffer({
          offerId: _offerId,
          payload,
        });

        /**
         * Handle error editing offer
         */
        if (!editResult?.ok) {
          throw new Error('Error editing offer');
        }

        /**
         * continue to publish offer if the action is publish
         */
        if (typeSubmit === SUBMIT_ACTION.Publish) {
          posthog.capture('publish_offer_cta');
          const publishResult = await publishOffer(_offerId);
          if (publishResult?.offerId) {
            handleSuccessEdit(publishResult?.offerId);
          }
          /**
           * if the action is save, we just call the success edit
           */
        } else if (typeSubmit === SUBMIT_ACTION.Save) {
          handleSuccessEdit(_offerId);
        }
      } catch (error) {
        if (error instanceof ApiApplicationError) {
          const { extraData } = error ?? {};
          if (extraData) {
            onPublishFailed(extraData as OfferSubscription);
          }
        }
        Logger.error('Error on submit offer', error);
      } finally {
        setSubmitMode(undefined);
      }
    },
    [
      editOffer,
      handleSuccessEdit,
      offerId,
      onPublishFailed,
      posthog,
      publishOffer,
    ]
  );

  if (!offer || !isConfigFetched) {
    return <LoadingView />;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={preventEnterKeySubmit}
      className="no-scrollbar relative flex min-h-0 max-w-full flex-1 flex-col-reverse justify-center gap-6 md:flex-row"
    >
      <div
        className={clsx(
          'flex w-full flex-col gap-3',
          'no-scrollbar max-h-full overflow-y-auto overflow-x-hidden',
          'rounded-lg bg-white p-6 pb-12 shadow-md'
        )}
      >
        <OfferInfoHeader offer={offer} />
        <OfferCoreForm form={form} config={config} />
      </div>
      {/* Fixed buttons container */}
      <div className="flex w-fit max-w-full flex-row gap-2 md:min-w-48 md:flex-col md:gap-4 md:pt-6">
        <MaterialActionButton
          type="submit"
          variant="contained"
          tint={colors['Primary-500']}
          value={SUBMIT_ACTION.Publish}
          isLoading={submitMode === 'publish' && isSubmitting}
          className="!md:min-w-48 whitespace-nowrap"
          isDisabled={isSubmitting}
        >
          {t('save_and_publish_offer_action')}
        </MaterialActionButton>
        {offer.status === OfferStatus.DRAFT && (
          <MaterialActionButton
            type="submit"
            variant="outlined"
            tint={colors['Primary-500']}
            value={SUBMIT_ACTION.Save}
            isLoading={submitMode === 'save' && isSubmitting}
            className="!md:min-w-48 whitespace-nowrap"
            isDisabled={isSubmitting}
          >
            {t('save_offer_action')}
          </MaterialActionButton>
        )}
        <MaterialActionButton
          variant="text"
          tint={colors['Primary-500']}
          className="!md:min-w-48 whitespace-nowrap"
          isDisabled={isSubmitting}
          onClick={handleCancelEdit}
        >
          {t('cancel_change_action')}
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

export default OfferEditForm;
