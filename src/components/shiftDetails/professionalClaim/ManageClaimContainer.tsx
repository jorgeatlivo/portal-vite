import { useTranslation } from 'react-i18next';

import { ActionButton } from '@/components/common/ActionButton';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface ManageClaimContainerProps {
  onAccept: () => void;
  onReject: () => void;
  inverse?: boolean;
  children?: React.ReactNode;
  acceptTitle?: string;
  rejectTitle?: string;
  hideIcons?: boolean;
  disableAccept?: boolean;
}

export const ManageClaimContainer: React.FC<ManageClaimContainerProps> = ({
  onAccept,
  onReject,
  inverse,
  children,
  acceptTitle,
  rejectTitle,
  hideIcons,
  disableAccept,
}) => {
  const { t } = useTranslation('shift-claim-details');

  const mainColor = colors[inverse ? 'Negative-500' : 'Primary-500'];
  const secondColor = colors[inverse ? 'Primary-500' : 'Negative-500'];

  return (
    <div className="flex w-full flex-col rounded-[12px] p-large shadow-custom">
      {children}
      <div className="mt-small flex w-full flex-wrap justify-between gap-small">
        <div className="flex flex-1">
          <ActionButton
            isLoading={false}
            onClick={onAccept}
            color={mainColor}
            isDisabled={disableAccept}
          >
            <div className="flex min-h-huge items-center space-x-small">
              <p className="action-regular">
                {acceptTitle || t('accept_request_label')}
              </p>
              {!hideIcons && <LivoIcon name="check" size={24} color="white" />}
            </div>
          </ActionButton>
        </div>
        <div className="flex flex-1">
          <ActionButton
            isLoading={false}
            onClick={onReject}
            color={secondColor}
            inverse={true}
            isDisabled={false}
          >
            <div
              className={`flex min-h-huge items-center space-x-small ${
                hideIcons ? 'py-tiny' : ''
              }`}
            >
              <p
                className="action-regular"
                style={{
                  color: secondColor,
                }}
              >
                {rejectTitle || t('reject_request_label')}
              </p>
              {!hideIcons && (
                <LivoIcon name="close" size={24} color={secondColor} />
              )}
            </div>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
