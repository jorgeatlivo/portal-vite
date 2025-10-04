import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormAutocomplete from '@/components/form/FormAutocomplete';
import FormSelect from '@/components/form/FormSelect';
import FormTextField from '@/components/form/FormTextField';

import { useFetchCities } from '@/pages/RegisterFlow/hooks/useFetchCities';
import { useFetchAppConfig } from '../hooks/useFetchAppConfig';

const Step3 = () => {
  const { t } = useTranslation('register');
  const { control } = useFormContext();
  const cityData = useFetchCities();
  const appData = useFetchAppConfig();

  const facilityType = useWatch({ control, name: 'facility_type' });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h3 className="text-center text-lg font-bold">
        {t('form_step_3_title')}
      </h3>
      <p className="mb-6 self-start text-start text-sm text-gray-600">
        {t('form_step_3_subtitle')}
      </p>

      <div className="w-full space-y-4">
        <FormTextField
          name="legal_name"
          control={control}
          label={t('form_step_3_legal_name')}
          placeholder={t('form_step_3_legal_name_placeholder')}
          variant="outlined"
          fullWidth
        />
        <FormTextField
          name="public_name"
          control={control}
          label={t('form_step_3_public_name')}
          placeholder={t('form_step_3_public_name_placeholder')}
          variant="outlined"
          fullWidth
        />
        <FormTextField
          name="cif"
          control={control}
          label={t('form_step_3_cif')}
          variant="outlined"
          fullWidth
        />
        <FormTextField
          name="address"
          control={control}
          label={t('form_step_3_address')}
          variant="outlined"
          fullWidth
        />
        <FormAutocomplete
          loading={cityData.isLoading}
          name="city_code"
          label={t('form_step_3_province')}
          control={control}
          options={cityData.cities}
          className="w-full"
          clearIcon={false}
        />
        <FormSelect
          name="facility_type"
          label={t('form_step_3_facility_type')}
          control={control}
          options={appData.config.facilityTypes}
          className="w-full"
        />
        {facilityType === 'OTHER' && (
          <FormTextField
            name="other_facility_type_name"
            control={control}
            label={t('form_step_3_other_facility_type_name')}
            variant="outlined"
            fullWidth
          />
        )}
        <FormTextField
          name="web_page"
          control={control}
          label={t('form_step_3_web_page')}
          variant="outlined"
          fullWidth
        />
      </div>
    </div>
  );
};

export default Step3;
