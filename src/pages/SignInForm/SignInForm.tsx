import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, Typography } from '@mui/material';
import { z } from 'zod';

import { ApiApplicationError } from '@/services/api';
import { APIService, APIServiceName } from '@/services/api.service';
import { login } from '@/services/authentication';

import DocumentLinks from '@/components/common/DocumentLinks';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';
import FormPasswordInput from '@/components/form/FormPasswordInput';
import FormTextField from '@/components/form/FormTextField';
import { ForgotPasswordModal } from '@/components/signIn/ForgotPasswordModal';

import { checkBannerDisplay } from '@/utils/bannerUtils';

import { useAuth } from '@/contexts/Authentication.context';

const schema = z.object({
  email: z.string().email('sign-in:invalid_email_error'),
  password: z.string().min(3, 'sign-in:password_minimum_error_message'),
});

type FormData = z.infer<typeof schema>;

const SignInForm = () => {
  const { t } = useTranslation('sign-in');
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  // const [mfaEmail, setMfaEmail] = useState("");

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      /**
       * reset error message and set loading state
       */
      setErrorMessage('');

      const signInResult = await login({
        userName: data.email,
        password: data.password,
      });

      /**
       * switch to MFA verification if MFA is enabled
       */
      // if (signInResult.mfaEnabled) {
      //   setMfaEmail(email);
      //   return;
      // }

      /**
       * if API returns an error message, throw it to error handler
       */
      // if (signInResult.errorMessage) {
      //   throw new ApiApplicationError(signInResult.errorMessage);
      // }

      /**
       * handle if not yet complete sign up
       * continue on step create facility
       */
      if (!signInResult.registerCompleted) {
        APIService.getInstance(APIServiceName.AUTHORIZED).updateConfig({
          token: `${signInResult.tokenType} ${signInResult.accessToken}`,
        });
        navigate('/register/new-account', { state: { activeStep: 3 } });
        return;
      }

      /**
       * set token if no error message is returned
       */
      setToken(`${signInResult.tokenType} ${signInResult.accessToken}`);
      localStorage.setItem('last_login', new Date().toISOString());

      /**
       * check banner display permissions after successful login
       */
      checkBannerDisplay();
    } catch (error) {
      /**
       * handle error
       */
      if (error instanceof ApiApplicationError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t('sign_in_error_message'));
      }
    }
  };

  return (
    <form noValidate className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-md gap-3.5 !rounded-lg bg-white p-4 shadow-lg">
        <CardContent className="flex flex-col space-y-medium">
          <Typography
            variant="body2"
            className="mt-4 flex gap-x-1 self-end text-center leading-normal"
          >
            {t('create_account_question')}
            <Link className="font-medium text-Primary-500" to="/register">
              {t('create_account_link')}
            </Link>
          </Typography>
          <Typography variant="h6" component="h2" className="mb-4 !text-f07">
            {t('login_title')}
          </Typography>
          <FormTextField
            name="email"
            control={control}
            placeholder={t('email_placeholder')}
            type="email"
          />
          <FormPasswordInput
            name="password"
            control={control}
            placeholder={t('password_placeholder')}
          />
          {errorMessage && (
            <p className="body-regular text-center text-red-500">
              {errorMessage}
            </p>
          )}
          <button
            type="button"
            className="action-regular py-large font-medium text-f01 text-Action-Secondary"
            onClick={() => setForgotPasswordModalOpen(true)}
          >
            <p>{t('forget_password')}</p>
          </button>
          <MaterialActionButton
            type="submit"
            variant="contained"
            isLoading={isSubmitting}
          >
            <p className="action-sm py-tiny text-white">
              {t('sign_in_button_label')}
            </p>
          </MaterialActionButton>

          <DocumentLinks />
        </CardContent>
        <ForgotPasswordModal
          isOpen={forgotPasswordModalOpen}
          onClose={() => setForgotPasswordModalOpen(false)}
        />
        {/* <VerifyMFAModal
          isOpen={mfaEmail !== ""}
          onClose={() => setMfaEmail("")}
          email={mfaEmail}
          onSignIn={(token: string) => {
            setToken(token);
          }}
          resendEmail={() => {
            handleSubmit();
          }}
        /> */}
      </Card>
    </form>
  );
};

export default SignInForm;
