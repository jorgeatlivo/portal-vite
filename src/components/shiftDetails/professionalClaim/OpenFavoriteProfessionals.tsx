import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider } from '@mui/material';

import ClickableRow from '@/components/common/ClickableRow';
import FavoriteProfessionalsModal from '@/components/professionals/FavoriteProfessionalsModal';

export default function OpenFavoriteProfessionals() {
  const { t } = useTranslation('professionals/favorite');
  const [favoriteProfessionalsModalOpen, setFavoriteProfessionalsModalOpen] =
    useState(false);

  return (
    <div>
      <Divider className="h-px bg-Divider-Default" />
      <div className="mt-large">
        <ClickableRow
          leftIcon="heart"
          text={t('open_favorite_professionals_label')}
          onClick={() => setFavoriteProfessionalsModalOpen(true)}
        />
      </div>

      <FavoriteProfessionalsModal
        isOpen={favoriteProfessionalsModalOpen}
        handleClose={() => setFavoriteProfessionalsModalOpen(false)}
      />
    </div>
  );
}
