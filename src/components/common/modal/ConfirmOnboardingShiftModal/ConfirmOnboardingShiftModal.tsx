import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton, Typography } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { z } from 'zod';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';
import FormSelect, { FormSelectOption } from '@/components/form/FormSelect';
import OnboardingShiftSection from '@/components/shiftDetails/OnboardingShiftSection';

import { useModal } from '@/hooks/use-modal';
import { SlotReasonOption } from '@/types/claims';
import { ShiftOnboarding } from '@/types/onboarding';
import { preventEnterKeySubmit } from '@/utils/form';
import { markdown } from '@/utils/markdown';

import colors from '@/config/color-palette';

function buildSchema({ enableReason }: { enableReason: boolean }) {
  const reasonSchema = enableReason
    ? z.string().min(1, 'confirm_onboarding_validation_reason')
    : z.string().optional();

  const schema = z.object({
    slotReason: reasonSchema,
  });

  return schema;
}

type FormData = z.infer<ReturnType<typeof buildSchema>>;

function ConfirmOnboardingShiftModal(props: {
  onConfirm: (reason?: string) => void;
  onboardingShift?: ShiftOnboarding;
  coverageShift?: ShiftOnboarding;
  slotReasonOptions?: SlotReasonOption[];
  claimId: number;
}) {
  const { t } = useTranslation('shift-claim-details');
  const { closeModal } = useModal();

  const schema = useMemo(() => {
    return buildSchema({
      enableReason: !!props.slotReasonOptions?.length,
    });
  }, [props.slotReasonOptions?.length]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slotReason: '',
    },
  });

  const onConfirm = (data: FormData) => {
    const reason = data.slotReason;
    props?.onConfirm(reason);
    closeModal();
  };

  const reasonOptions = useMemo(() => {
    return (
      props.slotReasonOptions?.map(
        (option) =>
          ({
            value: option.value,
            label: option.displayText,
          }) as FormSelectOption
      ) || []
    );
  }, [props.slotReasonOptions]);

  return (
    <form
      className="flex w-full flex-col justify-between gap-10"
      onSubmit={form.handleSubmit(onConfirm)}
      onKeyDown={preventEnterKeySubmit}
    >
      {/* Title */}
      <div className=" flex w-full flex-row items-center justify-center">
        <Typography
          variant="h5"
          className="text-center !font-bold !text-gray-900"
        >
          {t('confirm_onboarding_shift_modal_title', { count: 2 })}
        </Typography>
        <div className="!absolute right-10 top-10 self-end">
          <IconButton onClick={closeModal} size="medium">
            <IconX size={24} />
          </IconButton>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-row justify-between gap-4">
          <OnboardingShiftSection
            title={t('onboarding_shift_title')}
            className="flex-1"
            claimShift={props.onboardingShift}
          />
          <OnboardingShiftSection
            title={t('coverage_shift_title')}
            className="flex-1"
            claimShift={props.coverageShift}
            displayFields
          />
        </div>

        {/* Content */}
        <Typography variant="body2" className="w-6/12 pr-2 text-Text-Default">
          {markdown(
            t('confirm_onboarding_shift_fit_time_note').replace(
              'contact-us',
              'contact-us__' + props.claimId
            )
          )}
        </Typography>
      </div>

      {reasonOptions.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <Typography variant="body1" className="text-Text-Default">
            {t('confirm_onboarding_shift_reason_title')}
          </Typography>
          <FormSelect
            name="slotReason"
            control={form.control}
            label={t('confirm_onboarding_shift_reason_label')}
            options={reasonOptions}
          />
        </div>
      )}

      <Typography variant="body1" className="text-Text-Default">
        {t('confirm_onboarding_shift_accepting_note')}
      </Typography>

      {/* Action Buttons */}
      <div className="flex justify-center gap-10">
        <MaterialActionButton
          type="button"
          tint={colors['Action-Primary']}
          variant="outlined"
          className="!min-w-52"
          onClick={closeModal}
        >
          <p className="text-mediumtext-base">
            {t('onboarding_shift_confirm_back_btn')}
          </p>
        </MaterialActionButton>
        <MaterialActionButton
          type="submit"
          tint={colors['Action-Primary']}
          variant="contained"
          className="!min-w-52"
        >
          <p className="text-medium text-base text-white">
            {t('onboarding_shift_confirm_title', { count: 2 })}
          </p>
        </MaterialActionButton>
      </div>
    </form>
  );
}

export default ConfirmOnboardingShiftModal;
