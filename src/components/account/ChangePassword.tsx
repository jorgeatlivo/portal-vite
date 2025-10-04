import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { changePasswordRequest } from '@/services/account';
import { ApiApplicationError } from '@/services/api';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';
import FormPasswordInput from '@/components/form/FormPasswordInput';

interface ChangePasswordComponentProps {
  onSubmit: () => void;
}

const schema = z
  .object({
    oldPassword: z
      .string()
      .min(1, 'register:required_current_password_required'),
    newPassword: z.string().min(6, 'register:invalid_password_length'),
    confirmPassword: z.string().min(6, 'register:invalid_password_length'),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: 'register:confirm_password_incorrect',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof schema>;
export const ChangePasswordComponent: React.FC<
  ChangePasswordComponentProps
> = ({ onSubmit }) => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { t } = useTranslation(['settings']);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSaveNewPassword: SubmitHandler<ChangePasswordFormData> = async (
    payload
  ) => {
    try {
      await changePasswordRequest({
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      });
      onSubmit();
      dispatch(
        showToastAction({
          message: t('password_succeed_changed'),
          severity: 'success',
        })
      );
    } catch (error) {
      if (error instanceof ApiApplicationError) {
        setErrorMessage(error.message);
      }
    } finally {
    }
  };

  return (
    <form
      onChange={() => {
        setErrorMessage('');
      }}
      className="w-100 flex w-full flex-col gap-12 p-4 pb-8"
      onSubmit={form.handleSubmit(handleSaveNewPassword)}
    >
      <FormPasswordInput
        name="oldPassword"
        control={form.control}
        label={t('settings_screen_change_password_old')}
      />
      <div className="flex w-full flex-col gap-6">
        <FormPasswordInput
          name="newPassword"
          control={form.control}
          label={t('settings_screen_change_password_new')}
        />
        <FormPasswordInput
          name="confirmPassword"
          control={form.control}
          label={t('settings_screen_change_password_confirm')}
        />
      </div>
      {!!errorMessage && (
        <div className="mr-small flex flex-col space-y-small">
          <p className="body-regular text-Negative-500">{errorMessage}</p>
        </div>
      )}
      <MaterialActionButton
        type="submit"
        isLoading={form.formState.isSubmitting}
      >
        {t('settings_screen_change_password_button')}
      </MaterialActionButton>
    </form>
  );
};
