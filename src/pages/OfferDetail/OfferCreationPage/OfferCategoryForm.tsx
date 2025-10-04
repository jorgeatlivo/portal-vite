import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';

import { FormConfig } from '@/queries/offer-mutation';

import FormAutocomplete from '@/components/form/FormAutocomplete';
import FormSelect from '@/components/form/FormSelect';

import { OfferFormData } from '@/pages/OfferDetail/offer-form.config';

interface OfferCategoryFormProps {
  form: UseFormReturn<OfferFormData>;
  config?: FormConfig;
}

export default function OfferCategoryForm({
  form,
  config,
}: OfferCategoryFormProps) {
  const { t } = useTranslation('offers');
  const { control } = form;

  return (
    <Stack spacing={2}>
      {/* CATEGORY & SKILL */}
      <Stack direction={{ sm: 'column', md: 'row' }} spacing={2}>
        <FormAutocomplete
          required
          name="category"
          control={control}
          className="w-full sm:w-52"
          label={t('category')}
          options={config?.categories ?? []}
          clearIcon={false}
        />
        {config?.units.length ? (
          <FormSelect
            required
            name="livoUnit"
            control={control}
            className="w-full"
            label={t('unit')}
            options={config?.units ?? []}
          />
        ) : null}
        <FormSelect
          required
          name="professionalField"
          control={control}
          className="w-full"
          label={t('professionalField')}
          options={config?.professionalFields ?? []}
        />
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        className="!mb-3 !mt-1"
      >
        {t('note_for_category_and_skill')}
      </Typography>
    </Stack>
  );
}
