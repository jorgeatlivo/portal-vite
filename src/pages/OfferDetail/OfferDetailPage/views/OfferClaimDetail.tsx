import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';

import { Logger } from '@/services/logger.service';
import { trackFacilityViewed, updateOfferClaimStatus } from '@/services/offers';
import { OFFER_DETAIL_QUERY_ID } from '@/queries/offer-detail';
import { OFFER_LIST_QUERY_KEY } from '@/queries/offer-list';

import LivoIcon from '@/components/common/LivoIcon';
import { FEATURE_NOTIFICATIONS_QUERY_KEY } from '@/components/layout/hooks/use-fetch-feature-notifications';
import { ZombieOfferModal } from '@/components/Offer/ZombieOfferModal';

import { useModal } from '@/hooks/use-modal';
import { OfferClaim, OfferClaimStatus } from '@/types/offers';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import colors from '@/config/color-palette';
import { OfferClaimButton } from '../components/OfferClaimButton';
import { OfferProfessionalProfileSection } from '../components/OfferProfessionalProfile';
import { DiscloseDetailsModal } from '../modals/DiscloseDetailsModal';
import { HireOfferClaimModal } from '../modals/HireOfferClaimModal';
import { RejectOfferClaimModal } from '../modals/RejectOfferClaimModal';

interface OfferClaimDetailProps {
  selectedOfferClaim: OfferClaim;
  onClose: () => void;
  refreshClaims: () => void;
}

export const OfferClaimDetail: React.FC<OfferClaimDetailProps> = ({
  selectedOfferClaim,
  onClose,
  refreshClaims,
}) => {
  const { t } = useTranslation('offers');
  const location = useLocation();
  const { handleUncaughtError } = useUncaughtErrorHandler();
  const { openModal, closeModal } = useModal();

  const offerId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('offerId') ?? '';
    return parseInt(id);
  }, [location.search]);

  const [isVisible, setIsVisible] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (selectedOfferClaim && offerId) {
      trackFacilityViewed(offerId, selectedOfferClaim.id).catch((error) => {
        Logger.error('Failed to track facility viewed:', error);
      });
    }
  }, [selectedOfferClaim, offerId]);

  useEffect(() => {
    const element = document.getElementById('offer-claim-detail');
    if (element) {
      element.style.scrollBehavior = 'smooth';
      element.scrollTop = 0;
      element.style.scrollBehavior = 'auto';
    }
  }, [selectedOfferClaim]);

  function getFirstName(fullName: string) {
    return fullName.split(' ')[0];
  }

  function invalidateOfferQueries(offerId: number) {
    queryClient.invalidateQueries({
      queryKey: [OFFER_DETAIL_QUERY_ID, offerId.toString()],
    });
    queryClient.invalidateQueries({
      queryKey: [OFFER_LIST_QUERY_KEY],
    });
    queryClient.invalidateQueries({
      queryKey: [FEATURE_NOTIFICATIONS_QUERY_KEY],
    });
  }

  function discloseOfferDetail(offerId: number, claimId: number) {
    updateOfferClaimStatus(offerId, claimId, OfferClaimStatus.DETAILS_DISCLOSED)
      .then(() => {
        closeModal();
        refreshClaims();
        invalidateOfferQueries(offerId);
      })
      .catch((error) => {
        handleUncaughtError(error, t('error_disclose_offer_details'));
        Logger.error('Error on disclose offer detail', error);
      });
  }

  function hireOfferClaim(offerId: number, claimId: number) {
    updateOfferClaimStatus(offerId, claimId, OfferClaimStatus.HIRED)
      .then(() => {
        closeModal();
        refreshClaims();
      })
      .catch((error) => {
        handleUncaughtError(error, t('error_hire_offer_claim'));
        Logger.error('Error on hire offer claim', error);
      });
  }

  function rejectOfferClaim(
    offerId: number,
    claimId: number,
    reason: string,
    details: string
  ) {
    updateOfferClaimStatus(
      offerId,
      claimId,
      OfferClaimStatus.REJECTED,
      reason,
      details
    )
      .then(() => {
        closeModal();
        refreshClaims();
        invalidateOfferQueries(offerId);
      })
      .catch((error) => {
        handleUncaughtError(error, t('error_reject_offer_claim'));
        Logger.error('Error on reject offer claim', error);
      });
  }

  function handleClaimStatusAction(originalAction: () => void) {
    if (selectedOfferClaim.zombieClaim) {
      openModal(<ZombieOfferModal onClose={closeModal} />, {
        className: 'min-h-[200px] w-[610px] p-0',
      });
    } else {
      originalAction();
    }
  }

  const openDiscloseDetailsModal = () => {
    openModal(
      <DiscloseDetailsModal
        professionalName={getFirstName(
          selectedOfferClaim?.professionalProfile?.fullName
        )}
        onClose={closeModal}
        onAccept={() => {
          discloseOfferDetail(offerId!, selectedOfferClaim.id);
        }}
      />,
      { className: 'min-h-[225px] w-[400px] p-0' }
    );
  };

  const openHireModal = () => {
    openModal(
      <HireOfferClaimModal
        professionalName={getFirstName(
          selectedOfferClaim?.professionalProfile?.fullName
        )}
        onClose={closeModal}
        onAccept={() => {
          hireOfferClaim(offerId!, selectedOfferClaim.id);
        }}
      />,
      { className: 'min-h-[250px] w-[410px] p-0' }
    );
  };

  const openRejectModal = () => {
    openModal(
      <RejectOfferClaimModal
        professionalName={getFirstName(
          selectedOfferClaim?.professionalProfile?.fullName
        )}
        onClose={closeModal}
        rejectOfferClaim={(reason: string, details: string) => {
          rejectOfferClaim(offerId!, selectedOfferClaim.id, reason, details);
        }}
      />,
      { className: 'min-h-[200px] w-[410px] p-0' }
    );
  };

  const openZombieModal = () => {
    openModal(<ZombieOfferModal onClose={closeModal} />, {
      className: 'min-h-[200px] w-[610px] p-0',
    });
  };

  return (
    <section className="flex flex-1">
      <div
        className={clsx(
          `no-scrollbar absolute w-full !max-w-[580px] flex-1 flex-col rounded-xl bg-white transition-transform duration-300 md:flex md:self-stretch`,
          isVisible
            ? '-inset-px md:inset-auto md:translate-x-0'
            : 'md:translate-x-full'
        )}
      >
        <div className="flex h-full flex-1 flex-col p-4">
          {/* Header and Action Buttons */}
          <div className="mb-4 inline-flex items-start justify-between self-stretch">
            <button
              type="button"
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
              }}
            >
              <LivoIcon name="close" size={24} color={colors['Grey-700']} />
            </button>
            <div className="flex items-start justify-end gap-2">
              {selectedOfferClaim.status === OfferClaimStatus.VISIBLE && (
                <OfferClaimButton
                  label={t('btn_display_details')}
                  color="white"
                  backgroundColor={colors['Primary-500']}
                  onClick={() => {
                    handleClaimStatusAction(() => openDiscloseDetailsModal());
                  }}
                />
              )}

              {selectedOfferClaim.status ===
                OfferClaimStatus.DETAILS_DISCLOSED && (
                <OfferClaimButton
                  label={t('btn_mark_hired')}
                  color="white"
                  backgroundColor={colors['Primary-500']}
                  onClick={() => {
                    handleClaimStatusAction(() => openHireModal());
                  }}
                />
              )}

              {(selectedOfferClaim.status === OfferClaimStatus.VISIBLE ||
                selectedOfferClaim.status ===
                  OfferClaimStatus.DETAILS_DISCLOSED) && (
                <OfferClaimButton
                  label={t('btn_remove')}
                  color={colors['Text-Default']}
                  backgroundColor={colors['Red-200']}
                  onClick={() => {
                    handleClaimStatusAction(() => openRejectModal());
                  }}
                />
              )}
            </div>
          </div>
          {/* Scrollable Content Area */}
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <OfferProfessionalProfileSection
              profile={selectedOfferClaim?.professionalProfile}
              detailsDisclosed={
                selectedOfferClaim.status ===
                  OfferClaimStatus.DETAILS_DISCLOSED ||
                selectedOfferClaim.status === OfferClaimStatus.HIRED
              }
              callToActionText={
                selectedOfferClaim.status === OfferClaimStatus.VISIBLE
                  ? t('call_to_disclose_details')
                  : null
              }
              zombieClaim={selectedOfferClaim.zombieClaim}
              status={selectedOfferClaim.status}
              newScreeningSummary={selectedOfferClaim.newScreeningSummary}
              onZombieClaimAction={() => openZombieModal()}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
