import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateFacilityProfessional } from '@/services/professionals';

import ToggleSwitch from '@/components/common/ToggleSwitch';
import FavoriteProfessionalsModal from '@/components/professionals/FavoriteProfessionalsModal';
import RemoveFavoriteProfessionalModal from '@/components/professionals/RemoveFavoriteProfessionalModal';

import { ProfessionalProfileBrief } from '@/types/professional';

import { ShiftModalityEnum } from '@/types';

interface FavoriteProfessionalCardProps {
  profile: ProfessionalProfileBrief;
  className?: string;
}

export default function FavoriteCard({
  profile,
  className,
}: FavoriteProfessionalCardProps) {
  const { t } = useTranslation('professionals/favorite');
  const { id, favorite, modality } = profile;

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
        <div className="flex flex-col">
          <p className="subtitle-regular mb-tiny">
            {t('favorite_professional_label')}
          </p>

          <button
            type="button"
            onClick={() => setFavoriteProfessionalsModalOpen(true)}
            className="action-regular text-Primary-500"
          >
            {t('view_all_favorite_professionals_label')}
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
