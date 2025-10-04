import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Card, Typography } from '@mui/material';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import clsx from 'clsx';
import { isNull } from 'lodash-es';

import { ACCOUNT_TYPE, resetPassword, validateToken } from '@/services/account';
import { ApiApplicationError } from '@/services/api';

import LoadingView from '@/components/common/LoadingView';

import colors from '@/config/color-palette';
import ResetPasswordForm from './ResetPasswordForm';
import styles from './reset-password-flow.module.scss';

enum REQUEST_STATE {
  PENDING = 'pending',
  SUCCESS = 'success',
  INVALID_TOKEN = 'invalid_token',
  VALID_TOKEN = 'valid_token',
}

type ResetPasswordFlowProps = {
  accountType: ACCOUNT_TYPE;
};

export default function ResetPasswordFlow({
  accountType,
}: ResetPasswordFlowProps) {
  const { t } = useTranslation('reset-password');
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token') ?? '';
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [requestState, setRequestState] = useState<REQUEST_STATE>(
    REQUEST_STATE.PENDING
  );

  const onSubmit = useCallback(
    async ({ newPassword }: { newPassword: string }) => {
      if (errorMessage) {
        setErrorMessage(undefined);
      }

      if (isNull(token)) {
        return setRequestState(REQUEST_STATE.INVALID_TOKEN);
      }

      try {
        await resetPassword(accountType, token, newPassword);
        setRequestState(REQUEST_STATE.SUCCESS);
      } catch (error) {
        if (error instanceof ApiApplicationError) {
          setErrorMessage(error.message);
        }
      }
    },
    [accountType, errorMessage, token]
  );

  useEffect(() => {
    if (token === '') {
      setRequestState(REQUEST_STATE.INVALID_TOKEN);
      return;
    }

    (async () => {
      try {
        await validateToken(accountType, token);
        setRequestState(REQUEST_STATE.VALID_TOKEN);
        return;
      } catch {
        setRequestState(REQUEST_STATE.INVALID_TOKEN);
      }
    })();
  }, [accountType, token]);

  const renderCardContent = () => {
    switch (requestState) {
      case REQUEST_STATE.PENDING:
        return <LoadingView />;

      case REQUEST_STATE.VALID_TOKEN:
        return (
          <ResetPasswordForm onSubmit={onSubmit} errorMessage={errorMessage} />
        );

      case REQUEST_STATE.INVALID_TOKEN:
        return (
          <div className="flex flex-row">
            <IconCircleX color={colors['Red-500']} className="mt-1" />
            <div className="body-regular ml-small flex flex-col">
              <p className="mb-2 text-red-700">
                {t('password_reset_invalid_title')}
              </p>
              <p>{t('password_reset_invalid_body')}</p>
            </div>
          </div>
        );

      case REQUEST_STATE.SUCCESS:
        return (
          <div className="flex flex-row ">
            <IconCircleCheck color={colors['Green-500']} className="mt-1" />
            <p className="body-regular ml-small text-green-700">
              {t('password_reset_successful_title')}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col items-center bg-Secondary-900 xxs:!h-auto md:min-h-screen md:flex-1 md:justify-between md:overflow-hidden',
        styles.landing_background
      )}
    >
      <div className="flex h-screen w-full items-center justify-center">
        <Card className="m-4  flex min-h-[180px] w-full max-w-[420px] flex-col justify-between gap-4 overflow-hidden !rounded-lg bg-white p-10 shadow-lg">
          <Typography
            variant="h4"
            className="!mb-4 whitespace-nowrap !text-f07 font-bold"
          >
            {t('title')}
          </Typography>
          <div className="min-h-[40px] w-full">{renderCardContent()}</div>
        </Card>
      </div>
    </div>
  );
}
