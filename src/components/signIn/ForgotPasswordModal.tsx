import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { resetPasswordRequest } from '@/services/account';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { MaterialActionButton } from '@/components/common/MaterialActionButton';

import colors from '@/config/color-palette';
import { CustomInput } from '../../components/common/CustomInput';
import { ModalWithCloseButtonContainer } from '../../components/common/ModalWithCloseButton';

interface ForgotPasswordModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
  isOpen,
}) => {
  const { t } = useTranslation('sign-in');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const resetPassword = () => {
    setLoading(true);
    resetPasswordRequest(email)
      .then(() => {
        setLoading(false);
        dispatch(
          showToastAction({
            message: t('forget_password_success_message'),
            severity: 'success',
          })
        );
        setEmail('');
        onClose();
      })
      .catch((error) => {
        setLoading(false);
        onClose();
        setEmail('');
        dispatch(
          showToastAction({
            message: t('forget_password_error_message'),
            severity: 'error',
          })
        );
      });
  };

  return (
    <ModalWithCloseButtonContainer
      onClose={() => {
        onClose();
        setEmail('');
      }}
      isOpen={isOpen}
      title={t('forget_password_title')}
      style={{ width: '100%', maxWidth: '448px' }}
    >
      <div className="w-[448px]">
        <div className="flex flex-col p-large">
          <div className="flex flex-1 flex-col space-y-medium">
            <p className="heading-sm text-Text-Subtle">
              {t('forget_password_header')}
            </p>
            <CustomInput
              placeHolder={t('email_placeholder')}
              inputType="email"
              selectedValue={email}
              setValue={setEmail}
            />
          </div>
          <p className="info-caption pt-medium text-Text-Subtle">
            {t('forget_password_description')}
          </p>
        </div>
        <div className="flex flex-col items-end justify-end border-t border-Divider-Default p-large">
          <div className="flex flex-row self-end">
            <MaterialActionButton
              isLoading={loading}
              isDisabled={email === ''}
              tint={colors['Primary-500']}
              variant="contained"
              onClick={resetPassword}
              className="m-h-[40px] rounded-full bg-Primary-500 px-6 py-3 text-white hover:bg-Primary-500"
            >
              <p className="action-regular text-center">
                {t('forget_password_button')}
              </p>
            </MaterialActionButton>
          </div>
        </div>
      </div>
    </ModalWithCloseButtonContainer>
  );
};
