import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateFacilityProfessional } from '@/services/professionals';
import { fetchClaimInfoAction } from '@/store/actions/claimActions';
import { ClaimSummary } from '@/store/types';

import { CategoryTag } from '@/components/common/CategoryTag';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import RemoveFavoriteProfessionalModal from '@/components/professionals/RemoveFavoriteProfessionalModal';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import { ProfessionalProfile } from '@/types/claims';

interface ProfessionalProfileCardProps extends ProfessionalProfile {
  origin?: ClaimSummary;
  className?: string;
}

export default function ProfessionalProfileCard({
  id,
  firstName,
  lastName,
  profilePictureUrl,
  favorite,
  totalPerformedShifts,
  modality,
  origin,
  className,
  category,
}: ProfessionalProfileCardProps) {
  const { t } = useTranslation('professionals/profile');
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  const removeFavoriteModal = (
    <RemoveFavoriteProfessionalModal
      isOpen={modalOpen}
      handleClose={() => setModalOpen(false)}
      professionalId={id}
      unfavoriteProfessional={() => {
        updateFacilityProfessional(id.toString(), false);
        setIsFavorite(false);
        setModalOpen(false);
        if (
          origin?.professionalId === id &&
          origin?.shiftId &&
          origin?.claimId
        ) {
          dispatch(fetchClaimInfoAction(origin.shiftId, origin.claimId) as any);
        }
      }}
    />
  );

  function handleFavoritePress() {
    if (isFavorite) {
      setModalOpen(true);
    } else {
      updateFacilityProfessional(id.toString(), true);
      setIsFavorite(true);
      if (origin?.professionalId === id && origin?.shiftId && origin?.claimId) {
        dispatch(fetchClaimInfoAction(origin.shiftId, origin.claimId) as any);
      }
    }
  }

  return (
    <div className={`flex justify-between ${className}`}>
      <div className="flex flex-1">
        <div className="relative size-12">
          <ProfilePicture
            profilePictureUrl={profilePictureUrl}
            modality={modality || null}
            size={48}
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <h3 className="font-semibold text-lg">
            {firstName} {lastName}
          </h3>
          <CategoryTag text={category.displayText} />
          <div className="flex flex-row items-center">
            <p className="subtitle-sm">
              {t('total_shifts_subtitle', {
                num: totalPerformedShifts,
              })}
            </p>

            <p className="info-caption ml-tiny text-Grey-800">
              {t('total_shifts_subtitle_in_facility')}
            </p>
          </div>
        </div>
      </div>

      {isFavorite !== undefined && (
        <ToggleSwitch checked={isFavorite} onChange={handleFavoritePress} />
      )}

      {removeFavoriteModal}
    </div>
  );
}
