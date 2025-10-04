import { useTranslation } from 'react-i18next';

interface DiscloseDetailsModalProps {
  professionalName: string;
  onAccept: () => void;
  onClose: () => void;
}

export const DiscloseDetailsModal: React.FC<DiscloseDetailsModalProps> = ({
  professionalName,
  onAccept,
  onClose,
}) => {
  const { t } = useTranslation('offers');
  return (
    <section>
      <div className="px-6 pb-3 pt-6">
        <h3 className="heading-md mb-4">
          {t('review_details_modal_title', {
            professionalName: professionalName,
          })}
        </h3>
        <div
          className="body-regular"
          style={{
            alignSelf: 'flex-start',
            fontFamily: 'Roboto',
            fontSize: '16px',
            lineHeight: '20px',
            color: '#7D7D7D',
            marginBottom: '12px',
          }}
        >
          {t('review_details_modal_description')}
        </div>
      </div>
      <div className="px-3 pb-4 pt-6">
        <div className="flex flex-row items-center">
          {' '}
          {/* Changed margin-top to add space */}
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center px-small py-large text-center text-Primary-500"
          >
            <p className="action-regular w-full">
              {t('review_details_modal_cancel_button')}
            </p>
          </button>
          <button
            type="button"
            className="flex flex-1 rounded-[100px] bg-Primary-500 px-small py-large text-center text-Text-Inverse"
            onClick={onAccept}
          >
            <p className="action-regular w-full">
              {t('review_details_modal_accept_button')}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
