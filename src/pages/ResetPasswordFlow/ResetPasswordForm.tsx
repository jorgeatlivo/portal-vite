import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';
import FormPasswordInput from '@/components/form/FormPasswordInput';

const schema = z
  .object({
    newPassword: z.string().min(6, 'reset-password:invalid_password_length'),
    confirmPassword: z
      .string()
      .min(6, 'reset-password:invalid_password_length'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'reset-password:confirm_password_incorrect',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;
type ResetPasswordFormProps = {
  onSubmit: (data: { newPassword: string }) => void;
  errorMessage: string | undefined;
};

export default function ResetPasswordForm({
  onSubmit,
  errorMessage,
}: ResetPasswordFormProps) {
  const { t } = useTranslation('reset-password');
  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    errorMessage
      ? setError('newPassword', { type: 'manual', message: errorMessage })
      : clearErrors('newPassword');
  }, [errorMessage, setError, clearErrors]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-between gap-6">
        <div className="flex w-full flex-col gap-6">
          <FormPasswordInput
            name="newPassword"
            control={control}
            fullWidth
            label={t('new_password_label')}
          />
          <FormPasswordInput
            name="confirmPassword"
            control={control}
            fullWidth
            label={t('confirm_password_label')}
          />
        </div>
        <MaterialActionButton
          type="submit"
          variant="contained"
          isLoading={isSubmitting}
        >
          {t('submit_label')}
        </MaterialActionButton>
      </div>
    </form>
  );
}
