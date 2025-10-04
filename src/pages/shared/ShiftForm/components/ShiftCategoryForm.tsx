import React, { useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { IconHeartbeat } from '@tabler/icons-react';

import { selectCategories } from '@/store/selectors/account.selector';

import { Typography } from '@/components/atoms/Typography';
import { IconPatientInBed } from '@/components/common/icons/IconPatientInBed';
import FormAutocomplete from '@/components/form/FormAutocomplete';
import FormSelect from '@/components/form/FormSelect';

import { Category } from '@/types/common/category';

import colors from '@/config/color-palette';
import {
  ShiftFormData,
  ShiftFormOptions,
} from '@/pages/shared/ShiftForm/config/shift-form.config';

interface ShiftCategoryFormProps {
  form: UseFormReturn<ShiftFormData>;
  options?: ShiftFormOptions;
  isEditing?: boolean;
}

export default function ShiftCategoryForm({
  form,
  options,
  isEditing,
}: ShiftCategoryFormProps) {
  const { t } = useTranslation('publish-shift');
  const { control } = form;

  const selectedCategory = form.watch('category');

  const categories = useSelector(selectCategories);

  const categoryOptions = useMemo(
    () => categoriesToOptions(categories),
    [categories]
  );

  return (
    <>
      <Typography variant="subtitle/regular">
        {t('details_section_title')}
      </Typography>

      {/* CATEGORY & UNITS & FIELDS */}
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <FormAutocomplete
          autoFocus
          required
          fullWidth
          disabled={isEditing}
          name="category"
          control={control}
          className="w-full sm:w-52"
          label={t('category')}
          options={categoryOptions}
          clearIcon={false}
          icon={
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <>
                  {field?.value?.value && (
                    <div className="rounded border p-1">
                      <Typography variant="body/small">
                        {field?.value?.value ?? ''}
                      </Typography>
                    </div>
                  )}
                </>
              )}
            />
          }
        />
        {options?.unitConfigurable && (
          <FormSelect
            required
            name="livoUnit"
            control={control}
            className="w-full"
            disabled={
              isEditing || (!selectedCategory && !options?.units?.length)
            }
            label={t('unit')}
            options={options?.units ?? []}
            icon={<IconPatientInBed size={24} color={colors['Neutral-400']} />}
          />
        )}
        <FormSelect
          name="professionalField"
          control={control}
          className="w-full"
          disabled={
            isEditing ||
            (!selectedCategory && !options?.professionalFields?.length)
          }
          label={t('professionalField')}
          options={options?.professionalFields ?? []}
          icon={<IconHeartbeat size={24} color={colors['Neutral-400']} />}
        />
      </div>
    </>
  );
}

function categoriesToOptions(categories?: Category[]) {
  return (
    categories?.map((category) => ({
      label: category.displayText,
      value: category.code,
    })) ?? []
  );
}
