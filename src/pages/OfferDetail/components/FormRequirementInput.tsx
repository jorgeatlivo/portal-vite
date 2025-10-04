import React, { useEffect, useMemo, useRef } from 'react';
import { Control, FieldValues, Path, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IconButton, Stack } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { throttle } from 'lodash-es';

import { FormConfig } from '@/queries/offer-mutation';

import FormSelect from '@/components/form/FormSelect';

import colors from '@/config/color-palette';

interface FormRequirementInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  config?: FormConfig;
}

export const FormRequirementInput = <T extends FieldValues>({
  control,
  config,
  name,
}: FormRequirementInputProps<T>) => {
  const { t } = useTranslation('offers');
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const mountRef = useRef(false);

  const appendItem = useMemo(() => {
    return throttle(
      () => {
        append({ livoUnit: '', professionalField: '', experience: '' } as any, {
          shouldFocus: false,
        });
      },
      100,
      { leading: true, trailing: false }
    );
  }, [append]);

  useEffect(() => {
    if (fields.length === 0) {
      if (mountRef.current) return;
      appendItem();
    }
    mountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing={2}>
      {fields.map((field, index) => {
        const isLastItem = index === fields?.length - 1;

        return (
          <Stack
            key={field.id}
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
          >
            {/* Select Experience */}
            {config?.units.length ? (
              <FormSelect
                required
                name={`${name}.${index}.livoUnit` as Path<T>}
                control={control}
                className="w-full"
                label={t('unit')}
                options={config?.units ?? []}
                onChange={(e) => isLastItem && e.target.value && appendItem()}
              />
            ) : null}
            <FormSelect
              required
              name={`${name}.${index}.professionalField` as Path<T>}
              control={control}
              className="w-full"
              label={t('professionalField')}
              options={config?.professionalFields ?? []}
              onChange={(e) => isLastItem && e.target.value && appendItem()}
            />
            <FormSelect
              name={`${name}.${index}.experience` as Path<T>}
              control={control}
              label={t('experience')}
              options={config?.skillExperience ?? []}
            />
            {!isLastItem && (
              <IconButton onClick={() => remove(index)}>
                <IconX color={colors['Text-Light']} />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};
