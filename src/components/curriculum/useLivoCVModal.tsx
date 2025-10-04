import { useRef, useState } from 'react';

import { Logger } from '@/services/logger.service';
import { fetchProfessionalCVDetails } from '@/services/professionals';

import { LivoCVDetailsDTO } from '@/types/common/curriculum';

export function useLivoCVModal(professionalId?: number) {
  const [isOpen, setIsOpen] = useState(false);
  const [livoCVDetails, setLivoCVDetails] = useState<LivoCVDetailsDTO | null>(
    null
  );
  const currentProfessionalIdRef = useRef<number | null>();

  const loadLivoCVDetails = async () => {
    if (!professionalId) {
      return;
    }

    try {
      const response = await fetchProfessionalCVDetails(professionalId);
      setLivoCVDetails(response);
    } catch (error) {
      Logger.error(
        'Error loading Livo CV for professional:',
        professionalId,
        'error:',
        error
      );
    }
  };

  const showModal = async () => {
    if (!professionalId) {
      return;
    }

    if (!livoCVDetails || currentProfessionalIdRef.current !== professionalId) {
      await loadLivoCVDetails();
      currentProfessionalIdRef.current = professionalId;
    }

    setIsOpen(true);
  };

  const hideModal = () => setIsOpen(false);

  return {
    isOpen,
    livoCVDetails,
    loadLivoCVDetails,
    showModal,
    hideModal,
  };
}
