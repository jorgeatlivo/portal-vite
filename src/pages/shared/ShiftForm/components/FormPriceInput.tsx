import React from 'react';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import FormOptionalFieldContainer from '@/components/form/FormOptionalFieldContainer';

import { PublishShiftConfigurationDTO } from '@/types/publish-shift';

import { PriceSelector } from '@/pages/shared/ShiftForm/components/PriceSelector';
import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';

interface FormPriceInputProps {
  control: Control<ShiftFormData>;
  onboardingShifts?: PublishShiftConfigurationDTO['onboardingShifts'];
  disabled?: boolean;
}

function FormPriceInput({
  control,
  onboardingShifts,
  disabled,
}: FormPriceInputProps) {
  const { t } = useTranslation(['publish-shift', 'edit-shift']);

  return (
    <div className="w-full">
      <PriceSelector
        control={control}
        priceName="price"
        modalityName="priceMode"
        isDisabled={disabled}
        options={[
          { value: 'hourly', label: t('hourly_rate') },
          { value: 'total', label: t('total_rate') },
        ]}
      />
      <FormOptionalFieldContainer
        name="onboardingShiftsRequired"
        control={control}
        condition={(value) => value === true}
      >
        <Typography variant="body/regular" className="text-Text-Subtle">
          {t('onboarding_shift_title_with_unit', {
            unit: onboardingShifts?.pricing,
          })}
        </Typography>
      </FormOptionalFieldContainer>
    </div>
  );
}

export default FormPriceInput;
