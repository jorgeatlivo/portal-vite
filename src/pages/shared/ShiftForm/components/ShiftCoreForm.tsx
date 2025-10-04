import React, { useCallback, useMemo } from 'react';
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';

import { FillRatePrediction } from '@/services/fill-rate';

import FormOptionalFieldContainer from '@/components/form/FormOptionalFieldContainer';
import { SectionHeader } from '@/components/form/SectionHeader';

import { isSameDay } from '@/utils/datetime';

import colors from '@/config/color-palette';
import { CapacitySelector } from '@/pages/shared/ShiftForm/components/CapacitySelector';
import { CompensationOptionSelector } from '@/pages/shared/ShiftForm/components/CompensationOptionSelector';
import FormDetails from '@/pages/shared/ShiftForm/components/FormDetails';
import FormPriceInput from '@/pages/shared/ShiftForm/components/FormPriceInput';
import FormShiftCalendar from '@/pages/shared/ShiftForm/components/FormShiftCalendar';
import FormShiftTimeInDay from '@/pages/shared/ShiftForm/components/FormShiftTimeInDay';
import FormVisibilitySelector from '@/pages/shared/ShiftForm/components/FormVisibilitySelector';
import { OnboardingShiftCheckBox } from '@/pages/shared/ShiftForm/components/OnboardingShiftCheckBox';
import ProfessionalOptionItem, {
  renderSelected,
} from '@/pages/shared/ShiftForm/components/ProfessionalOptionItem';
import ShiftProfessionalAutocomplete from '@/pages/shared/ShiftForm/components/ShiftProfessionalAutocomplete';
import {
  ShiftFormData,
  ShiftFormOptions,
} from '@/pages/shared/ShiftForm/config/shift-form.config';
import { ShiftModalityEnum } from '@/types';

const STACK_DIRECTION = { xs: 'column' as const, md: 'row' as const };
const STACK_SPACING = 2;

interface ShiftCoreFormProps {
  form: UseFormReturn<ShiftFormData>;
  options: ShiftFormOptions;
  isEditMode?: boolean;
  defaultValues?: Partial<ShiftFormData>;
  fillRatePredictions?: FillRatePrediction[];
  disabled?: boolean;
}

function ShiftCoreForm({
  form,
  options,
  isEditMode,
  defaultValues,
  fillRatePredictions,
  disabled,
}: ShiftCoreFormProps) {
  const { control, setValue } = form;
  const { t } = useTranslation('publish-shift');

  const poolAndInternalOnboarded = useMemo(
    () => options.livoPoolOnboarded && options.livoInternalOnboarded,
    [options.livoPoolOnboarded, options.livoInternalOnboarded]
  );

  const bulkSelectionEnabled = useMemo(
    () => !isEditMode || (defaultValues?.dates?.length ?? 0) > 1,
    [isEditMode, defaultValues?.dates?.length]
  );

  const renderProfessionalOption = useCallback(
    (props: any, option: any, state: any) => (
      <ProfessionalOptionItem
        key={props?.key ?? option.value}
        props={props}
        option={option}
        _state={state}
      />
    ),
    []
  );

  const getSelectedDayColorBasedOnFillRate = useCallback(
    (dayString: string) => {
      if (!fillRatePredictions) return;

      const prediction = fillRatePredictions.find((prediction) =>
        isSameDay(prediction.startDate, dayString)
      );
      if (prediction?.isDisplayed === false) return;
      if (prediction?.predictedBand === 'LOW') return colors['Red-200'];
      if (prediction?.predictedBand === 'MEDIUM') return '#f9e199';
    },
    [fillRatePredictions]
  );

  const onboardingShiftCondition = useCallback((value: any) => !!value, []);

  const remunerationCondition = useCallback((value: any) => !!value, []);

  const compensationOptionsCondition = useCallback((value: any) => !!value, []);

  const invitedProfessionalsCondition = useCallback(
    (value: any) => !!value,
    []
  );

  const onHideInvitedProfessionals = useCallback(() => {
    setValue('invitedProfessionals', []);
  }, [setValue]);

  const onHideRemuneration = useCallback(() => {
    setValue('price', undefined);
    setValue('priceMode', 'total');
    setValue('onboardingShiftsRequired', false);
  }, [setValue]);

  const onHideOnboardingShift = useCallback(() => {
    setValue('onboardingShiftsRequired', false);
  }, [setValue]);

  return (
    <FormProvider {...form}>
      {/* SCHEDULE */}
      <div className="flex w-full flex-col gap-4">
        <SectionHeader
          title={t('schedule_section_title')}
          tooltip={t('schedule_section_tooltip')}
        />
        <Stack direction={STACK_DIRECTION} spacing={STACK_SPACING}>
          <FormShiftCalendar
            disabled={disabled}
            bulkSelectionEnabled={bulkSelectionEnabled}
            calendarSummary={options?.calendarSummary ?? []}
            getSelectedDayColor={getSelectedDayColorBasedOnFillRate}
          />
          <FormShiftTimeInDay
            disabled={disabled}
            shiftTimeOptions={options?.shiftTimeOptions}
          />
        </Stack>
      </div>

      {/* VISIBILITY */}
      {poolAndInternalOnboarded && (
        <div className="flex w-full flex-col gap-4">
          <SectionHeader
            title={t('visibility_section_title')}
            tooltip="Select the audience you want to see the shift you are posting."
          />
          <Stack direction={STACK_DIRECTION} spacing={STACK_SPACING}>
            <FormVisibilitySelector
              disabled={disabled}
              name="externalVisibility"
              control={control}
              icon={ShiftModalityEnum.EXTERNAL}
            />
            <FormVisibilitySelector
              disabled={disabled}
              name="internalVisibility"
              control={control}
              icon={ShiftModalityEnum.INTERNAL}
            />
          </Stack>
        </div>
      )}
      {/* ONBOARDING SHIFT */}
      {options?.onboardingShift?.featureEnabled && (
        <Stack direction={STACK_DIRECTION} spacing={STACK_SPACING}>
          <FormOptionalFieldContainer
            control={control}
            name="externalVisibility"
            condition={onboardingShiftCondition}
            onHide={onHideOnboardingShift}
          >
            <Controller
              name={'onboardingShiftsRequired'}
              control={control}
              render={({ field: { onChange, value } }) => (
                <OnboardingShiftCheckBox
                  disabled={disabled}
                  isOnboardingShift={!!value}
                  setOnboardingShift={onChange}
                />
              )}
            />
          </FormOptionalFieldContainer>
          <div className="w-full" />
        </Stack>
      )}

      {/* REMUNERATION */}
      <FormOptionalFieldContainer
        control={control}
        name="externalVisibility"
        condition={remunerationCondition}
        onHide={onHideRemuneration}
      >
        <>
          <SectionHeader title={t('remuneration_section_title')} />
          <Stack direction={STACK_DIRECTION} spacing={STACK_SPACING}>
            <FormPriceInput
              control={control}
              onboardingShifts={options?.onboardingShift}
              disabled={disabled}
            />
          </Stack>
        </>
      </FormOptionalFieldContainer>

      {options.compensationOptions?.configurable && (
        <FormOptionalFieldContainer
          control={control}
          name="internalVisibility"
          condition={compensationOptionsCondition}
        >
          <CompensationOptionSelector
            compensationOptions={options.compensationOptions.options ?? []}
            name={'compensationOptions'}
            control={control}
            disabled={disabled}
          />
        </FormOptionalFieldContainer>
      )}

      {/* CAPACITY */}
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title={t('capacity_section_title')} />
        <Stack direction={STACK_DIRECTION} spacing={STACK_SPACING}>
          <CapacitySelector
            disabled={disabled}
            control={control}
            name={'capacity'}
            maxCapacity={5}
          />
        </Stack>
      </div>

      {/* PROFESSIONAL SELECTION */}
      <FormOptionalFieldContainer
        name="externalVisibility"
        control={control}
        condition={invitedProfessionalsCondition}
        onHide={onHideInvitedProfessionals}
      >
        <ShiftProfessionalAutocomplete
          isEditMode={isEditMode}
          disabled={disabled}
          control={control}
          label={t('add_professional_label')}
          placeholder={t('add_professional_placeholder')}
          renderOption={renderProfessionalOption}
          renderSelected={renderSelected}
        />
      </FormOptionalFieldContainer>

      {/* ADDITIONAL INFORMATION */}
      <div className="flex w-full flex-col gap-4">
        <SectionHeader title={t('additional_information_section_title')} />
        <FormDetails control={control} disabled={disabled} />
      </div>
    </FormProvider>
  );
}

export default ShiftCoreForm;
