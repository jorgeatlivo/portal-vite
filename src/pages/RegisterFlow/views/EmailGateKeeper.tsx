import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, Typography } from '@mui/material';
import { usePostHog } from 'posthog-js/react';
import { z } from 'zod';

import { ApiApplicationError } from '@/services/api';
import { confirmEmailAvailable } from '@/services/authentication';

import DocumentLinks from '@/components/common/DocumentLinks';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';
import FormTextField from '@/components/form/FormTextField';

const schema = z.object({
  email: z.string().email('register:invalid_email_error'),
});

type FormData = z.infer<typeof schema>;

const EmailGateKeeper: FC = () => {
  const posthog = usePostHog();
  const { t } = useTranslation(['sign-in', 'register']);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [errorMessage, setErrorMessage] = useState('');

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      email,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      /**
       * reset error message and set loading state
       */
      setErrorMessage('');
      posthog.capture('register_center_cta');
      const result = await confirmEmailAvailable(data.email);

      if (result.emailExist) {
        throw new ApiApplicationError(t('register:email_already_registered'));
      }

      navigate('/register/new-account', { state: { email: data.email } });
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
            {t('register:login_question')}
            <Link className="font-medium text-Primary-500" to="/signin">
              {t('register:login_link')}
            </Link>
          </Typography>
          <Typography variant="h6" component="h2" className="!text-f08">
            {t('register:register_title')}
          </Typography>
          <Typography
            variant="body2"
            className="py-4 text-left !text-f01 leading-r02"
          >
            {t('register:register_subtitle')}
          </Typography>

          <FormTextField
            name="email"
            control={control}
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            placeholder={t('register:register_input_placeholder')}
          />

          {errorMessage && (
            <p className="body-regular text-center text-red-500">
              {errorMessage}
            </p>
          )}

          <div className="mb-2" />
          <MaterialActionButton
            variant="contained"
            type="submit"
            isDisabled={false}
            isLoading={isSubmitting}
          >
            <p className="action-sm py-tiny text-white">
              {t('register:register_button_label')}
            </p>
          </MaterialActionButton>

          <DocumentLinks />
        </CardContent>
      </Card>
    </form>
  );
};

export default EmailGateKeeper;
