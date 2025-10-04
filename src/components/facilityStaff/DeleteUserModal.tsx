import { useTranslation } from 'react-i18next';

import { InformationRow } from '@/components/common/InformationRow';
import { ModalContainer } from '@/components/common/ModalContainer';

interface DeleteUserModalProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  userName: string;
  email: string;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  onDelete,
  onClose,
  isOpen,
  userName,
  email,
}) => {
  const { t } = useTranslation([
    'internal-professional-page',
    'facility-staff',
  ]);
  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <div className="w-[410px] rounded-[16px] bg-white shadow-custom">
        <div className="space-y-large px-xLarge py-medium">
          <p className="heading-md mb-large">
            {t('facility-staff:delete_user_modal_title')}
          </p>
          <div className="flex flex-col space-y-medium rounded-[8px] p-medium ring-1 ring-Divider-Strong">
            <InformationRow
              iconName="user"
              style={{
                paddingVertical: '8px',
              }}
            >
              <p className="body-regular">{userName}</p>
            </InformationRow>
            <InformationRow
              iconName="mail"
              style={{
                paddingVertical: '8px',
              }}
            >
              <p className="body-regular">{email}</p>
            </InformationRow>
          </div>
          <div className="flex flex-row items-center">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex flex-1 items-center justify-center px-small py-large  text-center text-Primary-500"
            >
              <p className="action-regular w-full">{t('cancel_label')}</p>
            </button>
            <button
              type="button"
              className={`flex flex-1 rounded-[100px] bg-Negative-400 px-small py-large text-center text-Text-Inverse`}
              onClick={() => onDelete()}
            >
              <p className="action-regular w-full">
                {t('facility-staff:delete_user_button')}
              </p>
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
