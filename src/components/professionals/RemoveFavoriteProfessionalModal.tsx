import { useTranslation } from 'react-i18next';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import { ConfirmationModal } from '../common/ConfirmationModal';

type RemoveFavoriteProfessionalModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  professionalId: number;
  unfavoriteProfessional: (professionalId: number) => void;
};

export default function RemoveFavoriteProfessionalModal({
  isOpen,
  handleClose,
  professionalId,
  unfavoriteProfessional,
}: RemoveFavoriteProfessionalModalProps) {
  const { t } = useTranslation('professionals/favorite');
  return (
    <ConfirmationModal
      isOpen={isOpen}
      handleClose={handleClose}
      title={t('remove_favorite_professional_title')}
      dismissTitle={t('remove_favorite_professional_dismiss_title')}
      buttonTitle={t('remove_favorite_professional_button_title')}
      onDismiss={handleClose}
      onPress={() => unfavoriteProfessional(professionalId)}
      buttonColor={colors['Negative-400']}
    >
      <Typography variant="body/regular" className="pb-3">
        {t('remove_favorite_professional_description_1')}
      </Typography>
      <Typography variant="body/regular">
        {t('remove_favorite_professional_description_2')}
      </Typography>
    </ConfirmationModal>
  );
}
