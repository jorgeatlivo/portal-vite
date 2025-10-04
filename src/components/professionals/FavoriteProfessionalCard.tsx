import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateFacilityProfessional } from '@/services/professionals';

import ToggleSwitch from '@/components/common/ToggleSwitch';

import { ProfessionalProfile } from '@/types/claims';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { Typography } from '../atoms/Typography';
import FavoriteProfessionalsModal from './FavoriteProfessionalsModal';
import RemoveFavoriteProfessionalModal from './RemoveFavoriteProfessionalModal';

interface FavoriteProfessionalCardProps {
  professionalProfile: ProfessionalProfile;
  shiftId?: number;
  claimId?: number;
  className?: string;
}

export default function FavoriteProfessionalCard({
  professionalProfile,
  shiftId,
  claimId,
  className,
}: FavoriteProfessionalCardProps) {
  const { t } = useTranslation('professionals/favorite');
  const { id, favorite, modality } = professionalProfile;

  const [isFavorite, setIsFavorite] = useState(favorite);
  const [removeFavoriteModalOpen, setRemoveFavoriteModalOpen] = useState(false);
  const [favoriteProfessionalsModalOpen, setFavoriteProfessionalsModalOpen] =
    useState(false);

  if (modality !== ShiftModalityEnum.EXTERNAL || favorite === undefined) {
    return null;
  }

  const removeFavoriteModal = (
    <RemoveFavoriteProfessionalModal
      isOpen={removeFavoriteModalOpen}
      handleClose={() => setRemoveFavoriteModalOpen(false)}
      professionalId={id}
      unfavoriteProfessional={() => {
        updateFacilityProfessional(id.toString(), false);
        setIsFavorite(false);
        setRemoveFavoriteModalOpen(false);
      }}
    />
  );

  const favoriteProfessionalsModal = (
    <FavoriteProfessionalsModal
      isOpen={favoriteProfessionalsModalOpen}
      handleClose={() => setFavoriteProfessionalsModalOpen(false)}
      origin={
        shiftId && claimId
          ? { professionalId: professionalProfile.id, shiftId, claimId }
          : undefined
      }
    />
  );

  function handleFavoritePress() {
    if (isFavorite) {
      setRemoveFavoriteModalOpen(true);
    } else {
      updateFacilityProfessional(id.toString(), true);
      setIsFavorite(true);
    }
  }

  return (
    <div className={`rounded-small bg-white p-large ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-tiny">
          <Typography variant="subtitle/regular">
            {t('favorite_professional_label')}
          </Typography>

          <button
            type="button"
            onClick={() => setFavoriteProfessionalsModalOpen(true)}
          >
            <Typography variant="action/small" color={colors['Primary-500']}>
              {t('view_all_favorite_professionals_label')}
            </Typography>
          </button>
        </div>

        {isFavorite !== undefined && (
          <ToggleSwitch checked={isFavorite} onChange={handleFavoritePress} />
        )}
      </div>

      {removeFavoriteModal}
      {favoriteProfessionalsModal}
    </div>
  );
}
