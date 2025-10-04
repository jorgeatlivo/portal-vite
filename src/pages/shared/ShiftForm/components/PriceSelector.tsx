import { Control, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { IconCashBanknote, IconCurrencyEuro } from '@tabler/icons-react';

import CurrencyFormat from '@/components/form/CurrencyInputCore';
import FormSelect, { FormSelectOption } from '@/components/form/FormSelect';
import FormTextField from '@/components/form/FormTextField';

import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';

interface PriceSelectorProps {
  priceName: Path<ShiftFormData>;
  modalityName: Path<ShiftFormData>;
  control: Control<ShiftFormData>;
  isDisabled?: boolean;
  options: FormSelectOption[];
}

export const PriceSelector = ({
  priceName,
  modalityName,
  control,
  options,
  isDisabled,
}: PriceSelectorProps) => {
  const { t } = useTranslation('publish-shift');
  return (
    <div className="flex w-full flex-col gap-2">
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        style={{ pointerEvents: isDisabled ? 'none' : 'all' }}
      >
        <FormTextField
          fullWidth
          name={priceName}
          control={control}
          label={t('price_input')}
          placeholder={t('price_input')}
          disabled={isDisabled}
          InputProps={{
            inputComponent: CurrencyFormat,
            endAdornment: (
              <InputAdornment position="end">
                <IconCurrencyEuro className="text-Neutral-400" size={24} />
              </InputAdornment>
            ),
            startAdornment: (
              <InputAdornment position="start">
                <IconCashBanknote size={24} className="text-Neutral-400" />
              </InputAdornment>
            ),
          }}
        />
        <FormSelect
          name={modalityName}
          control={control}
          label={t('price_mode_dropdown')}
          disabled={isDisabled}
          options={options}
        />
      </Stack>
    </div>
  );
};
