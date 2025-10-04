import React, { useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

import { Logger } from '@/services/logger.service';
import { fetchFacilityProfessionals } from '@/services/professionals';
import { ClaimSummary } from '@/store/types';

import { FacilityProfessionals } from '@/components/widgets/professionals/FacilityProfessionals';
import { FacilityProfessionalsDTO } from '@/components/widgets/professionals/types';

interface FavoriteProfessionalsSectionProps {
  origin?: ClaimSummary;
}

const FavoriteProfessionalsSection: React.FC<
  FavoriteProfessionalsSectionProps
> = ({ origin }) => {
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
    loadFacilityProfessionals();
  }, []);

  return (
    <div className="modern-scrollbar flex w-full flex-col gap-6 overflow-y-auto">
      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex-1">
          <FacilityProfessionals
            professionals={facilityProfessionals.professionals}
            placeholder={facilityProfessionals.placeholder}
            origin={origin}
            className="max-h-fit"
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(FavoriteProfessionalsSection);
