import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress } from '@mui/material';

import { Logger } from '@/services/logger.service';
import { fetchFacilityProfessionals } from '@/services/professionals';
import { ClaimSummary } from '@/store/types';

import { ModalContainer } from '@/components/common/ModalContainer';
import { HeaderComponent } from '@/components/publishShift/HeaderComponent';
import { FacilityProfessionals } from '@/components/widgets/professionals/FacilityProfessionals';
import { FacilityProfessionalsDTO } from '@/components/widgets/professionals/types';

interface FavoriteProfessionalsModalProps {
  isOpen: boolean;
  handleClose: () => void;
  origin?: ClaimSummary;
}

const FavoriteProfessionalsModal: React.FC<FavoriteProfessionalsModalProps> = ({
  isOpen,
  handleClose,
  origin,
}) => {
  const { t } = useTranslation('professionals/favorite');
  const initialFacilityProfessionals: FacilityProfessionalsDTO = {
    professionals: [],
    placeholder: {
      input: '',
      professionalsList: '',
    },
  };
  const [facilityProfessionals, setFacilityProfessionals] =
    useState<FacilityProfessionalsDTO>(initialFacilityProfessionals);
  const [loading, setLoading] = useState(false);

  const loadFacilityProfessionals = () => {
    setLoading(true);
    fetchFacilityProfessionals()
      .then((response) => {
        setFacilityProfessionals(response);
        setLoading(false);
      })
      .catch((error) => {
        Logger.error('fetchFacilityProfessionals', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      loadFacilityProfessionals();
    }
  }, [isOpen]);

  return (
    <ModalContainer
      isOpen={isOpen}
      style={{ width: '95dvw', maxWidth: '500px' }}
      onClose={handleClose}
    >
      <div className="mx-auto flex h-full max-h-[85dvh] flex-col !rounded-2xl bg-white">
        <div className="flex-none">
          <HeaderComponent
            title={t('manage_favorite_professionals_title')}
            onClose={handleClose}
          />
        </div>

        {loading ? (
          <div className="flex h-[600px] w-[700px] items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-b-2xl">
            <FacilityProfessionals
              professionals={facilityProfessionals.professionals}
              placeholder={facilityProfessionals.placeholder}
              origin={origin}
            />
          </div>
        )}
      </div>
    </ModalContainer>
  );
};

export default React.memo(FavoriteProfessionalsModal);
