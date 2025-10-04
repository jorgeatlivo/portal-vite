import { useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Card, IconButton, Typography } from '@mui/material';
import { IconArrowNarrowLeft, IconX } from '@tabler/icons-react';
import throttle from 'lodash-es/throttle';
import { usePostHog } from 'posthog-js/react';

import { APIService, APIServiceName } from '@/services/api.service';
import {
  CreateFacilityPayload,
  createFacility,
  createNewAccount,
} from '@/services/authentication';
import FlagsService from '@/services/flags.service';

import DocumentLinks from '@/components/common/DocumentLinks';
import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import colors from '@/config/color-palette';
import { FLAGS } from '@/config/flag-enums';
import { useAuth } from '@/contexts/Authentication.context';
import FormStepper from '@/pages/RegisterFlow/components/FormStepper';
import { normalizeCIF } from '@/pages/RegisterFlow/helpers';
import {
  FormStep,
  RegisterFormData,
  steps,
} from '@/pages/RegisterFlow/register-form.config';
import styles from '../styles/RegisterFormAnimation.module.scss';

const RegisterForm = () => {
  const posthog = usePostHog();
  const { t } = useTranslation('register');
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();
  const email = location.state?.email || '';
  const [activeStep, setActiveStep] = useState<FormStep>(
    steps.find((step) => step.index === location.state?.activeStep) ?? steps[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [animationClass, setAnimationClass] = useState(styles.visible);
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(activeStep.schema),
    mode: 'onBlur',
    defaultValues: {
      email,
      first_name: '',
      last_name: '',
      password: '',
      confirm: '',
      phone: '',
      address: '',
      cif: '',
      legal_name: '',
      public_name: '',
      web_page: '',
      city_code: { value: '', label: '' },
      country_code: { code: 'ES', label: '🇪🇸 +34', value: '+34' },
    },
  });

  const { handleSubmit } = methods;

  const onClose = () => {
    navigate('/register');
  };

  const onNext = () => {
    setAnimationClass(styles.exitToLeft);
    setTimeout(() => {
      setDirection(1);
      setActiveStep((prevActiveStep) => {
        const nextIndex = prevActiveStep.nextIndex;
        if (!nextIndex) return prevActiveStep;
        const nextStep = steps.find((step) => step.index === nextIndex);
        if (!nextStep) return prevActiveStep;
        return nextStep;
      });
      setAnimationClass(styles.enterFromRight);
      setTimeout(() => setAnimationClass(styles.visible), 50);
    }, 300);
  };

  const onBack = useCallback(() => {
    if (activeStep.backBehavior === 'back') {
      setAnimationClass(styles.exitToRight);
      setTimeout(() => {
        setDirection(-1);
        setActiveStep((prevActiveStep) => {
          const prevIndex = prevActiveStep.prevIndex;
          if (!prevIndex) return prevActiveStep;
          const prevStep = steps.find((step) => step.index === prevIndex);
          if (!prevStep) return prevActiveStep;
          return prevStep;
        });
        setAnimationClass(styles.enterFromLeft);
        setTimeout(() => setAnimationClass(styles.visible), 50);
      }, 300);
    } else if (activeStep.backBehavior === 'navigate-back') {
      navigate('/register', { state: { email } });
    }
  }, [activeStep.backBehavior, email, navigate]);

  const onRegisterNewAccount = async (formData: RegisterFormData) => {
    const payload = {
      email: formData.email,
      phoneNumber: `${formData.country_code.value}${formData.phone}`,
      firstName: formData.first_name,
      lastName: formData.last_name,
      password: formData.password,
    };
    const result = await createNewAccount(payload);

    if (result.accessToken && !result.registerCompleted) {
      APIService.getInstance(APIServiceName.AUTHORIZED).updateConfig({
        token: `${result.tokenType} ${result.accessToken}`,
      });
    }
  };

  const onCreateFacility = useCallback(
    async (formData: RegisterFormData) => {
      const payload: CreateFacilityPayload = {
        address: formData.address,
        cif: normalizeCIF(formData.cif),
        legalName: formData.legal_name,
        publicName: formData.public_name,
        webPage: formData.web_page,
        cityCode: formData.city_code.value,
        facilityType: formData.facility_type,
        otherFacilityTypeName: formData.other_facility_type_name,
      };
      const result = await createFacility(payload);

      if (result.accessToken && result.registerCompleted) {
        setToken(`${result.tokenType} ${result.accessToken}`);
        FlagsService.setFlag(FLAGS.WELCOME_FIRST_LOGIN, true);
      }
    },
    [setToken]
  );

  const onClickBack = useMemo(() => {
    return throttle(() => onBack(), 1000, { leading: true, trailing: false });
  }, [onBack]);

  const onClickActionButton = useMemo(() => {
    return throttle(
      async (formData: RegisterFormData) => {
        try {
          setIsLoading(true);
          if (activeStep.index === 1) {
            posthog.capture('create_account_cta');
            await onRegisterNewAccount(formData);
          } else if (activeStep.index === 3) {
            posthog.capture('create_center_cta');
            await onCreateFacility(formData);
          }

          onNext();
        } catch (error: any) {
          setErrorMessage(error?.message);
        } finally {
          setIsLoading(false);
        }
      },
      1000,
      { leading: true, trailing: false }
    );
  }, [activeStep.index, onCreateFacility]);

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={handleSubmit(onClickActionButton)}
        onChange={() => setErrorMessage('')}
      >
        <Card className="flex min-h-[890px] w-full min-w-[720px] max-w-xl flex-col justify-between gap-4 overflow-hidden !rounded-lg bg-white p-10 shadow-lg">
          {/* Header */}
          <div className="relative flex w-full items-center py-4">
            <div className="grid w-full grid-cols-3 items-center px-4">
              <div className="flex justify-start">
                {!!activeStep.backBehavior ? (
                  <IconButton onClick={onClickBack}>
                    <IconArrowNarrowLeft
                      size={24}
                      color={colors['Text-Subtle']}
                    />
                  </IconButton>
                ) : (
                  <div className="w-10" />
                )}
              </div>

              <div className="flex justify-center">
                <Typography
                  variant="h4"
                  className="whitespace-nowrap !text-f07 font-bold"
                >
                  {t('register_facility')}
                </Typography>
              </div>

              <div className="flex justify-end">
                <IconButton onClick={onClose}>
                  <IconX size={24} color={colors['Text-Subtle']} />
                </IconButton>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <FormStepper activeStep={activeStep} />

          <div className="flex flex-1 flex-col justify-evenly gap-4">
            {/* Form */}
            <div className={styles.stepContainer}>
              <div
                key={activeStep.id}
                className={`${styles.step} ${animationClass}`}
              >
                {!!activeStep.component && <activeStep.component />}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col self-end py-4">
            {errorMessage && (
              <p className="body-regular text-center text-red-500">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <MaterialActionButton
              type="submit"
              variant="contained"
              isLoading={isLoading}
            >
              {t(activeStep.submitLabel as never)}
            </MaterialActionButton>

            <DocumentLinks />
          </div>
        </Card>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
