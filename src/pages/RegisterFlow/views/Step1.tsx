import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormAutocomplete from '@/components/form/FormAutocomplete';
import FormPasswordInput from '@/components/form/FormPasswordInput';
import FormTextField from '@/components/form/FormTextField';

const Step1 = () => {
  const { t } = useTranslation('register');
  const { control } = useFormContext();

  return (
    <div className="flex w-full flex-col gap-4">
      <h3 className="mt-4 text-center text-lg font-bold">
        {t('form_step_1_title')}
      </h3>
      <p className="mb-4 text-sm text-gray-600">{t('form_step_1_subtitle')}</p>

      <div className="grid grid-cols-2 gap-3">
        <FormTextField
          name="first_name"
          control={control}
          label={t('form_step_1_first_name')}
          variant="outlined"
          autoComplete="given-name"
          fullWidth
        />
        <FormTextField
          name="last_name"
          control={control}
          label={t('form_step_1_last_name')}
          variant="outlined"
          autoComplete="family-name"
          fullWidth
        />
      </div>

      <FormTextField
        name={'email'}
        disabled
        control={control}
        label={t('form_step_1_email')}
        variant="outlined"
        fullWidth
        type="email"
        className="mt-3"
        autoComplete="email"
      />

      <div className="mt-3 flex gap-2">
        <FormAutocomplete
          name="country_code"
          label={t('form_step_1_prefix')}
          control={control}
          options={countryOptions}
          className="w-44"
          clearIcon={false}
        />

        <FormTextField
          name={'phone'}
          control={control}
          label={t('form_step_1_phone')}
          type="tel"
          variant="outlined"
          fullWidth
          className="mt-3"
          autoComplete="tel"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {t('form_step_1_phone_helper')}
      </p>

      <FormPasswordInput
        name="password"
        control={control}
        label={t('form_step_1_password')}
        variant="outlined"
        fullWidth
        className="mt-3"
        autoComplete="new-password"
      />
      <FormPasswordInput
        name="confirm"
        control={control}
        label={t('form_step_1_repeated_password')}
        variant="outlined"
        fullWidth
        className="mt-3"
        autoComplete="new-password"
      />
    </div>
  );
};

type CountryOption = {
  code: string;
  label: string;
  value: string;
};

const countryOptions: CountryOption[] = [
  { code: 'ES', label: '🇪🇸 +34', value: '+34' },
  { code: 'IT', label: '🇮🇹 +39', value: '+39' },
  // { code: "DE", label: "🇩🇪 +49", value: "+49" },
  // { code: "FR", label: "🇫🇷 +33", value: "+33" },
  // { code: "US", label: "🇺🇸 +1", value: "+1" },
];

export default Step1;
