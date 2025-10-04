import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePostHog } from 'posthog-js/react';

import { Logger } from '@/services/logger.service';
import { selectCategories } from '@/store/selectors/account.selector';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import { getSearchParam } from '@/hooks/use-search-params';
import { Category, CategoryCode } from '@/types/common/category';
import { Shift, ShiftTimeInDayEnum } from '@/types/shifts';
import { today } from '@/utils/datetime';
import { preventEnterKeySubmit } from '@/utils/form';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import colors from '@/config/color-palette';
import PageHeader from '@/pages/shared/ShiftForm/components/PageHeader';
import ShiftCategoryForm from '@/pages/shared/ShiftForm/components/ShiftCategoryForm';
import ShiftCoreForm from '@/pages/shared/ShiftForm/components/ShiftCoreForm';
import { SubmitLabel } from '@/pages/shared/ShiftForm/components/ShiftFormLabel';
import {
  buildFormOptions,
  buildInitialFormData,
  buildShiftFormSchema,
  rehydrateInitFormData as rehydrateInitialFormData,
  ShiftFormData,
  staticDefault,
} from '@/pages/shared/ShiftForm/config/shift-form.config';
import { FillRateBanner } from '@/pages/shared/ShiftForm/FillRateBanner';
import { useFetchFillRatePrediction } from '@/pages/shared/ShiftForm/hooks/useFetchFillRatePrediction';
import { usePublishShiftConfig } from '@/pages/shared/ShiftForm/hooks/useShiftMutation';
import { calculateTotalPay } from '@/pages/shared/ShiftForm/utils/totalPayUtils';

interface ShiftCreationFormProps {
  onSubmit: (data: ShiftFormData) => Promise<void>;
  back?: () => void;
}

const ShiftCreationForm = ({ onSubmit, back }: ShiftCreationFormProps) => {
  const posthog = usePostHog();
  const { t } = useTranslation(['publish-shift', 'edit-shift']);
  const state = useLocation().state;
  const categories = useSelector(selectCategories);

  const [unitConfigurable, setUnitConfigurable] = useState(false);

  const schema = useMemo(
    () => buildShiftFormSchema({ unitConfigurable }),
    [unitConfigurable]
  );
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...staticDefault,
      category: getInitCategory(state?.shift?.category || categories?.[0]),
    },
  });
  const {
    watch,
    formState: { isSubmitting },
  } = form;

  const {
    dates,
    externalVisibility,
    internalVisibility,
    price,
    priceMode,
    livoUnit,
    ...values
  } = watch();

  const fillRatePrediction = useFetchFillRatePrediction({
    ...values,
    unit: livoUnit,
    externalVisible: externalVisibility,
    internalVisible: internalVisibility,
    totalPay: calculateTotalPay(
      price,
      values.startTime,
      values.endTime,
      priceMode
    ),
    recurrentDates: dates,
    category: values.category?.value ?? '',
    shiftId: undefined,
  });

  const selectedCategory = form.watch('category');

  const { config } = usePublishShiftConfig(
    selectedCategory?.value as CategoryCode
  );

  const options = useMemo(() => buildFormOptions(config), [config]);
  const { handleUncaughtError } = useUncaughtErrorHandler();

  const onSubmitForm = useCallback(
    async (formData: ShiftFormData) => {
      try {
        posthog.capture('create_shift_cta');
        await onSubmit({
          ...formData,
          temporalId: fillRatePrediction.data?.temporalId,
        });
      } catch (error) {
        handleUncaughtError(error, t('publish_error_header'));
        Logger.error('Error on publish shift', error);
      }
    },
    [
      fillRatePrediction.data?.temporalId,
      handleUncaughtError,
      onSubmit,
      posthog,
      t,
    ]
  );

  useEffect(() => {
    setUnitConfigurable(options.unitConfigurable ?? false);
  }, [options]);

  /**
   * Reset form state when config changes (category changes)
   */
  useEffect(() => {
    if (!config) return;

    // get date search params
    const selectedDay = getSearchParam('date') || today().format('YYYY-MM-DD');
    const shiftTimeInDay =
      (getSearchParam('shift-time') as ShiftTimeInDayEnum) ||
      ShiftTimeInDayEnum.MORNING;
    const category = form.getValues('category');
    const initialShift = state?.shift as Shift | undefined;

    let initialFormData;
    if (initialShift && initialShift.category) {
      initialFormData = rehydrateInitialFormData({
        initialShift,
        configs: config,
        isEdit: false,
      });
    } else {
      initialFormData = buildInitialFormData({
        configs: config,
        selectedDay: selectedDay,
        selectedCategoryCode: category?.value as string,
        shiftTimeInDay: shiftTimeInDay,
      });
    }

    form.reset(initialFormData);
  }, [config, form, state]);

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmitForm)}
      onKeyDown={preventEnterKeySubmit}
      className="
      mx-2 flex size-full flex-1 flex-col gap-6 overflow-hidden py-6"
    >
      <PageHeader title={t('new_shift_title')} back={back}>
        <MaterialActionButton
          isLoading={isSubmitting}
          variant="contained"
          type="submit"
          tint={colors['Primary-500']}
        >
          <SubmitLabel control={form.control} />
        </MaterialActionButton>
      </PageHeader>
      <div
        className={
          'relative flex size-full flex-1 justify-center overflow-hidden'
        }
      >
        <div className="flex w-full max-w-4xl flex-col overflow-y-auto rounded-lg bg-white shadow-md">
          <FillRateBanner
            recurrentDates={dates.length > 1}
            data={fillRatePrediction.data}
          />
          <div className="modern-scrollbar flex flex-col gap-6 bg-white p-6 pb-12">
            <ShiftCategoryForm form={form} options={options} />
            <ShiftCoreForm
              form={form}
              options={options}
              disabled={!config}
              fillRatePredictions={fillRatePrediction.data?.predictions}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

function getInitCategory(category?: Category) {
  if (!category) {
    return null;
  }

  return {
    value: category.code || '',
    label: category.displayText || '',
  };
}

export default ShiftCreationForm;
