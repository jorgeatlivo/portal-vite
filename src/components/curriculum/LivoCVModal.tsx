import { useTranslation } from 'react-i18next';

import { ModalWithCloseButtonContainer } from '@/components/common/ModalWithCloseButton';

import { LivoCVDetailsDTO } from '@/types/common/curriculum';

import { QualificationCard } from './QualificationCard';

interface LivoCVModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  livoCVDetails: LivoCVDetailsDTO;
  fullScreen?: boolean;
  style?: any;
}

export function LivoCVModal({
  title,
  isOpen,
  onClose,
  livoCVDetails,
  fullScreen,
  style,
}: LivoCVModalProps) {
  const { t } = useTranslation('professionals/profile');
  return (
    <ModalWithCloseButtonContainer
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      style={style}
    >
      <div className="h-3/4 overflow-y-scroll bg-Grey-050 p-4">
        <QualificationCard
          qualification={livoCVDetails.education}
          messageWhenEmpty={t('no_education_message')}
        />
        <QualificationCard
          className="mt-3"
          qualification={livoCVDetails.experience}
          messageWhenEmpty={t('no_experience_message')}
        />
        {livoCVDetails.internship ? (
          <QualificationCard
            className="mt-3"
            qualification={livoCVDetails.internship}
          />
        ) : null}
      </div>
    </ModalWithCloseButtonContainer>
  );
}
