import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePostHog } from 'posthog-js/react';

import { Logger } from '@/services/logger.service';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import { Category, CategoryCode } from '@/types/common/category';
import { Shift } from '@/types/shifts';
import { preventEnterKeySubmit } from '@/utils/form';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import colors from '@/config/color-palette';
import PageHeader from '@/pages/shared/ShiftForm/components/PageHeader';
import ShiftCategoryForm from '@/pages/shared/ShiftForm/components/ShiftCategoryForm';
import ShiftCoreForm from '@/pages/shared/ShiftForm/components/ShiftCoreForm';
import { SubmitLabel } from '@/pages/shared/ShiftForm/components/ShiftFormLabel';
import {
  buildFormOptions,
  buildShiftFormSchema,
  rehydrateInitFormData as rehydrateInitialFormData,
  ShiftFormData,
  staticDefault,
} from '@/pages/shared/ShiftForm/config/shift-form.config';
import { FillRateBanner } from '@/pages/shared/ShiftForm/FillRateBanner';
import { useFetchFillRatePrediction } from '@/pages/shared/ShiftForm/hooks/useFetchFillRatePrediction';
import { usePublishShiftConfig } from '@/pages/shared/ShiftForm/hooks/useShiftMutation';
import { calculateTotalPay } from '@/pages/shared/ShiftForm/utils/totalPayUtils';

interface ShiftModificationFormProps {
  onSubmit: (data: ShiftFormData) => Promise<void>;
  back?: () => void;
  shift?: Shift;
}

const ShiftModificationForm = ({
  onSubmit,
  back,
  shift,
}: ShiftModificationFormProps) => {
  const posthog = usePostHog();
  const { t } = useTranslation(['publish-shift', 'edit-shift']);
  const [unitConfigurable, setUnitConfigurable] = useState(false);
  const schema = useMemo(
    () => buildShiftFormSchema({ unitConfigurable }),
    [unitConfigurable]
  );
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...staticDefault,
      category: getInitCategory(shift?.category),
    },
  });
  const {
    watch,
    formState: { isSubmitting },
  } = form;

  const {
    dates,
    startTime,
    endTime,
    externalVisibility,
    internalVisibility,
    price,
    priceMode,
    livoUnit,
    ...values
  } = watch();

  const fillRatePrediction = useFetchFillRatePrediction({
    ...values,
    externalVisible: externalVisibility,
    internalVisible: internalVisibility,
    startTime: startTime.slice(0, 23),
    endTime: endTime.slice(0, 23),
    totalPay: calculateTotalPay(price, startTime, endTime, priceMode),
    unit: livoUnit,
    recurrentDates: dates,
    category: values.category?.value ?? '',
    shiftId: shift?.id,
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
        posthog.capture('edit_shift_cta');
        await onSubmit(formData);
      } catch (error) {
        handleUncaughtError(error, t('edit-shift:error_editing_header'));
        Logger.error('Error on edit shift', error);
      }
    },
    [handleUncaughtError, onSubmit, posthog, t]
  );

  useEffect(() => {
    setUnitConfigurable(options.unitConfigurable ?? false);
  }, [options]);

  useEffect(() => {
    if (!config) return;
    const initialShift = shift as Shift | undefined;

    if (!initialShift) return;

    const _default = rehydrateInitialFormData({
      initialShift,
      configs: config,
      isEdit: false,
    });

    form.reset(_default);
  }, [config, form, shift]);

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmitForm)}
      onKeyDown={preventEnterKeySubmit}
      className="
      mx-2 flex size-full flex-1 flex-col gap-6  overflow-hidden py-6"
    >
      <PageHeader
        title={t('edit-shift:edit_shift_title', {
          shift: shift?.externalId ?? '',
        })}
        back={back}
      >
        <MaterialActionButton
          isLoading={isSubmitting}
          variant="contained"
          type="submit"
          tint={colors['Primary-500']}
        >
          <SubmitLabel control={form.control} isEditing />
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
            <ShiftCategoryForm form={form} options={options} isEditing />
            <ShiftCoreForm
              form={form}
              options={options}
              fillRatePredictions={fillRatePrediction.data?.predictions}
              disabled={!config}
              isEditMode
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

export default ShiftModificationForm;
