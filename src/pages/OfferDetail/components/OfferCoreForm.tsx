import { UseFormReturn, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { IconCurrencyEuro, IconHelp } from '@tabler/icons-react';

import { FormConfig } from '@/queries/offer-mutation';

import CurrencyFormat from '@/components/form/CurrencyInputCore';
import FormCheckbox from '@/components/form/FormCheckbox';
import FormOptionalFieldContainer from '@/components/form/FormOptionalFieldContainer';
import FormRichContentSelectCheckbox from '@/components/form/FormRichContentSelectCheckbox';
import FormSelect from '@/components/form/FormSelect';
import FormSelectCheckbox from '@/components/form/FormSelectCheckBox';
import FormTextField from '@/components/form/FormTextField';

import { ContractType } from '@/types/offers';

import colors from '@/config/color-palette';
import FormOptionDateCalendar from '@/pages/OfferDetail/components/FormOptionDateCalendar';
import { FormRequirementInput } from '@/pages/OfferDetail/components/FormRequirementInput';
import { OfferFormData } from '@/pages/OfferDetail/offer-form.config';

const OfferCoreForm = ({
  form,
  config,
}: {
  form: UseFormReturn<OfferFormData>;
  config?: FormConfig;
}) => {
  const { t } = useTranslation('offers');
  const { control, trigger } = form;

  const noExperienceToggled = useWatch({ control, name: 'no_experience' });

  return (
    <>
      {/* CONTRACT */}
      <Typography
        variant="subtitle1"
        className="!font-semibold text-Text-Default"
      >
        {t('contract')}
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormSelect
          required
          name="contractType"
          control={control}
          label={t('type_of_contract')}
          options={config?.contractTypes ?? []}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormOptionDateCalendar
          required
          fullWidth
          name="startDate"
          optionName="startDateType"
          control={control}
          label={t('start_date')}
          options={config?.startDate ?? []}
          trigger={trigger}
        />
        <FormOptionalFieldContainer
          name="contractType"
          control={control}
          condition={(value) => value !== ContractType.PERMANENT}
        >
          <FormOptionDateCalendar
            name="duration"
            optionName="durationType"
            control={control}
            options={config?.durationTypes ?? []}
            fullWidth
            label={t('duration')}
            trigger={trigger}
          />
        </FormOptionalFieldContainer>
      </Stack>
      <FormSelectCheckbox
        required
        name="schedule"
        control={control}
        multiple
        options={config?.contractSchedules ?? []}
        label={t('schedule')}
      />
      <FormTextField
        name="scheduleDetails"
        control={control}
        className="!mb-4"
        fullWidth
        label={t('schedule_details')}
        placeholder={t('schedule_details_placeholder')}
      />

      {/* SALARY */}
      <Box className="mb-1 mt-5">
        <Stack direction="row" alignItems="center" spacing={0}>
          <Typography
            variant="subtitle1"
            className="!font-semibold text-Text-Default"
          >
            {t('salary')}
          </Typography>
          <Tooltip title={t('salary_tooltip')} arrow>
            <IconButton size="small">
              <IconHelp size={20} color={colors['Text-Default']} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormTextField
          required
          name="salaryMin"
          control={control}
          fullWidth
          type="text"
          label={t('salary_min')}
          InputProps={{
            inputComponent: CurrencyFormat,
            endAdornment: (
              <InputAdornment position="end">
                <IconCurrencyEuro color={colors['Text-Subtle']} size={24} />
              </InputAdornment>
            ),
          }}
        />
        <FormTextField
          name="salaryMax"
          control={control}
          fullWidth
          type="text"
          label={t('salary_max')}
          InputProps={{
            inputComponent: CurrencyFormat,
            endAdornment: (
              <InputAdornment position="end">
                <IconCurrencyEuro color={colors['Text-Subtle']} size={24} />
              </InputAdornment>
            ),
          }}
        />
        <FormSelect
          required
          name="salaryPeriod"
          control={control}
          label={t('period')}
          options={config?.salaryPeriods ?? []}
          className="!w-96 max-w-full"
        />
      </Stack>
      <FormTextField
        name="salaryDetails"
        control={control}
        className="!mb-5"
        fullWidth
        label={t('salary_detail')}
        placeholder={t('salary_placeholder')}
      />

      {/* BENEFITS */}
      <Typography
        variant="subtitle1"
        className="!font-semibold text-Text-Default"
      >
        {t('benefits_additional')}
      </Typography>
      <FormRichContentSelectCheckbox
        enableOtherSelect
        name="perks"
        control={control}
        multiple
        options={config?.perks ?? []}
        placeholder={t('benefits_placeholder')}
      />

      {/* REQUIREMENTS */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={0}>
          <Typography
            variant="subtitle1"
            className="!font-semibold text-Text-Default"
          >
            {t('requirements')}
          </Typography>
          <Tooltip title={t('requirements_tooltip')} arrow>
            <IconButton size="small">
              <IconHelp size={20} color={colors['Text-Default']} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <FormCheckbox
        control={control}
        label={t('no_experience')}
        name="no_experience"
      />
      {noExperienceToggled ? null : (
        <FormRequirementInput
          name="requirements"
          control={control}
          config={config}
        />
      )}

      <FormTextField
        name="additionalRequirements"
        control={control}
        className="!mb-4"
        fullWidth
        label={t('other_requirements')}
        placeholder={t('other_requirements_placeholder')}
      />

      {/* ADDITIONAL INFORMATION */}
      <Typography
        variant="subtitle1"
        className="!font-semibold text-Text-Default"
      >
        {t('additional_information')}
      </Typography>
      <FormTextField
        name="details"
        control={control}
        fullWidth
        multiline
        minRows={3}
        maxRows={3}
        placeholder={t('additional_information_placeholder')}
      />
    </>
  );
};

export default OfferCoreForm;
