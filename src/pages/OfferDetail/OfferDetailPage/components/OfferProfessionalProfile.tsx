import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

import { RootState } from '@/store/types';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import { LivoCVModal } from '@/components/curriculum/LivoCVModal';
import { useLivoCVModal } from '@/components/curriculum/useLivoCVModal';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';
import { ProfessionalLivoReviews } from '@/components/shiftDetails/professionalClaim/ProfessionalLivoReviews';

import { CVType } from '@/types/common/curriculum';
import { OfferClaimStatus, OfferProfessionalProfile } from '@/types/offers';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { OfferClaimStatusTag } from './OfferStatusTag';

interface OfferProfessionalProfileProps {
  profile: OfferProfessionalProfile;
  detailsDisclosed: boolean;
  callToActionText: string | null;
  status: OfferClaimStatus;
  newScreeningSummary: boolean;
  zombieClaim: boolean;
  onZombieClaimAction?: () => void;
}

export const OfferProfessionalProfileSection: React.FC<
  OfferProfessionalProfileProps
> = ({
  profile,
  detailsDisclosed,
  callToActionText,
  status,
  newScreeningSummary,
  zombieClaim,
  onZombieClaimAction,
}) => {
  const { t } = useTranslation([
    'professional-claim',
    'professionals/profile',
    'offers',
  ]);
  const account = useSelector((state: RootState) => state.account);
  const livoCVModal = useLivoCVModal(profile.id);
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(
    profile.screeningSummary ? false : !profile.cvSummary
  );
  const hasLivoCV = profile.availableCVTypes?.includes(CVType.LIVO_CV);
  const hasPdfUpload = profile.availableCVTypes?.includes(CVType.PDF_UPLOAD);

  const screeningSummary = profile.screeningSummary;

  const screenCallSuccess =
    screeningSummary &&
    screeningSummary?.availableData?.summary.length > 0 &&
    !screeningSummary?.notAvailableMessage;

  const showBlurModal = () => {
    if (onZombieClaimAction) {
      onZombieClaimAction();
    }
  };

  const handleLivoCVClick = () => {
    if (zombieClaim) {
      showBlurModal();
    } else {
      livoCVModal.showModal();
    }
  };

  const handleDownloadCVClick = (e: React.MouseEvent) => {
    if (zombieClaim) {
      e.preventDefault();
      showBlurModal();
    } else {
      window.open(profile.professionalCV, '_blank');
    }
  };

  const toggleAiSummary = () => {
    setIsAiSummaryOpen(!isAiSummaryOpen);
  };

  const renderSummaryValue = (
    index: number,
    checked: boolean | null,
    displayText: string | null
  ) => {
    // Positions from the array of summary items that are checked
    const checkedPositions = [0, 1, 3];

    if (checkedPositions.includes(index)) {
      if (checked === true) {
        return (
          <div className="flex gap-2">
            <IconCircleCheck className="mt-[2px] size-5 shrink-0 text-Green-500" />
            <Typography variant="body/regular">{displayText}</Typography>
          </div>
        );
      }
      if (checked === false) {
        return (
          <div className="flex gap-2">
            <IconCircleX className="mt-[2px] size-5 shrink-0 text-Red-500" />
            <Typography variant="body/regular">{displayText}</Typography>
          </div>
        );
      }
    }

    return (
      displayText && (
        <Typography variant="body/regular">{displayText}</Typography>
      )
    );
  };

  useEffect(() => {
    if (profile.screeningSummary?.availableData) {
      setIsAiSummaryOpen(false);
    } else {
      setIsAiSummaryOpen(true);
    }
  }, [profile.screeningSummary]);

  return (
    <section className="flex w-full flex-col p-4">
      {/* Profile Header */}
      <div className="mb-4 flex flex-col items-center">
        <ProfilePicture
          profilePictureUrl={profile?.profilePictureUrl}
          modality={zombieClaim ? null : ShiftModalityEnum.EXTERNAL}
          size={64}
          style={{
            filter: zombieClaim ? 'blur(6px)' : 'none',
          }}
        />
        <Typography
          variant="heading/medium"
          className={zombieClaim ? 'blur-content' : ''}
        >
          {profile.fullName}
        </Typography>
      </div>
      {status === OfferClaimStatus.HIRED && (
        <div className="mb-2 w-fit flex-none">
          <OfferClaimStatusTag status={status} />
        </div>
      )}

      {/* Professional Data Title */}
      <div className="mb-2 flex gap-2">
        <LivoIcon size={24} name="id-badge-2" color={colors['Grey-400']} />
        <Typography variant="body/regular">
          {t('professional_data_title')}
        </Typography>
      </div>

      {/* Professional Data Content */}
      <div
        className={`flex flex-col ${
          detailsDisclosed ? 'rounded-lg bg-Primary-100 p-4' : ''
        }`}
      >
        {detailsDisclosed && (
          <>
            <div className="mb-2 flex space-x-2">
              <Typography variant="body/regular" color={colors['Text-Subtle']}>
                {t('telephone_label')}:
              </Typography>

              <Typography variant="subtitle/regular">
                {profile.phoneNumber}
              </Typography>
            </div>
            <div className="mb-2 flex space-x-2">
              <Typography variant="body/regular" color={colors['Text-Subtle']}>
                {t('email_label')}:
              </Typography>

              <Typography variant="body/regular">{profile.email}</Typography>
            </div>
          </>
        )}
        {/* License Number & Experience */}
        {profile.licenseNumber !== null && (
          <section>
            <div className="mb-2 flex space-x-2">
              <Typography variant="body/regular" color={colors['Text-Subtle']}>
                {t('license_number_label')}:
              </Typography>
              <Typography
                variant="subtitle/regular"
                className={zombieClaim ? 'blur-content' : ''}
              >
                {profile.licenseNumber}
              </Typography>
            </div>
          </section>
        )}
        {/* Experience */}
        {(hasLivoCV || hasPdfUpload) && (
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col">
              <span className="body-regular text-Text-Subtle">
                {t('experience_label')}:
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start justify-start gap-2 pt-px md:flex-row">
              {hasLivoCV && (
                <Typography
                  onClick={handleLivoCVClick}
                  variant="subtitle/regular"
                  color={colors['Primary-500']}
                  className={
                    'cursor-pointer text-center hover:underline md:text-start'
                  }
                >
                  {t('view_livo_cv_label')}
                </Typography>
              )}

              {hasLivoCV && hasPdfUpload && (
                <Typography
                  variant="subtitle/regular"
                  className="hidden text-Text-Subtle md:block"
                >
                  |
                </Typography>
              )}
              {hasPdfUpload && (
                <Typography
                  onClick={handleDownloadCVClick}
                  variant="subtitle/regular"
                  color={colors['Primary-500']}
                  className={
                    'cursor-pointer text-center hover:underline md:text-start'
                  }
                >
                  {t('download_cv_label')}
                </Typography>
              )}
            </div>
          </div>
        )}
        {callToActionText && (
          <Typography
            variant="body/small"
            color={colors['Text-Subtle']}
            className="pt-2"
          >
            {t('offers:call_to_disclose_details')}
          </Typography>
        )}
      </div>

      {screeningSummary ? (
        <>
          {/* Details Hiring AI Summary */}
          <hr className="my-6 w-full border-Divider-Default" />
          <div className="flex flex-row items-center gap-2">
            <LivoIcon size={24} name="sparkles" color={colors['Grey-400']} />
            {newScreeningSummary && (
              <div className="ml-2">
                <div className="size-2 rounded-full bg-Primary-500"></div>
              </div>
            )}

            <Typography variant="body/regular">
              {t('professionals/profile:professional_ai_screening_title')}
            </Typography>
          </div>
          {screenCallSuccess ? (
            <div className="mt-5 gap-2">
              <div className="flex flex-col gap-2">
                {screeningSummary?.availableData?.summary.map(
                  (item: any, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <Typography
                        variant="body/regular"
                        color={colors['Text-Subtle']}
                        className="w-fit whitespace-nowrap"
                      >
                        {item.dataPoint}:
                      </Typography>
                      {renderSummaryValue(
                        index,
                        item.value.checked,
                        item.value.displayText
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <Typography
              variant="body/regular"
              color={colors['Grey-700']}
              className="pt-2"
            >
              {screeningSummary?.notAvailableMessage}
            </Typography>
          )}
        </>
      ) : null}

      {/* AI CV Summary */}
      <hr className="my-6 w-full border-Divider-Default" />
      <div className="flex w-full gap-3">
        <div className="flex items-center gap-2">
          <LivoIcon size={24} name="sparkles" color={colors['Grey-400']} />
          <Typography variant="body/regular">
            {t('professionals/profile:professional_ai_cv_title')}
          </Typography>
        </div>
        {profile.cvSummary && (
          <button
            type="button"
            onClick={toggleAiSummary}
            className="flex items-center"
          >
            <LivoIcon
              size={20}
              name={isAiSummaryOpen ? 'chevron-up' : 'chevron-down'}
              color={colors['Grey-400']}
            />
          </button>
        )}
      </div>

      {profile.cvSummary ? (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isAiSummaryOpen ? 'mt-2 max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Typography variant="body/regular" color={colors['Grey-700']}>
            {profile.cvSummary}
          </Typography>
        </div>
      ) : (
        <Typography
          variant="body/regular"
          color={colors['Grey-700']}
          className="pt-2"
        >
          {t('professionals/profile:professional_ai_cv_not_available')}
        </Typography>
      )}

      {/* Facility Experience */}
      <hr className="my-6 w-full border-Divider-Default" />
      <div className="flex flex-col">
        <div className="mb-5 flex items-center space-x-2">
          <LivoIcon
            size={24}
            name="report-medical"
            color={colors['Grey-400']}
          />
          <Typography variant="body/regular">
            {t('facility_experience')}
          </Typography>
        </div>
        <div className="flex items-center rounded-lg bg-white p-3 ring-1 ring-Divider-Subtle">
          <div className="flex-1">
            <Typography variant="subtitle/regular">
              {t('completed_shifts')}
            </Typography>
            {account.accountInfo && (
              <Typography variant="body/regular" color={colors['Text-Subtle']}>
                {t('in')} {account.accountInfo.facility.name}
              </Typography>
            )}
          </div>
          <Typography variant="heading/small" className={'mr-3'}>
            {profile.totalShiftsInFacility}
          </Typography>
        </div>
        {/* Reviews */}
        {profile.professionalReview?.averageRating && (
          <div className="mb-6 pt-5">
            <ProfessionalLivoReviews
              review={profile.professionalReview}
              noPadding={true}
            />
          </div>
        )}
      </div>
      {livoCVModal.livoCVDetails && (
        <LivoCVModal
          fullScreen
          style={{ width: '100%', maxWidth: '600px' }}
          title={t('professional_livo_cv_title', {
            fullName: profile.fullName,
          })}
          isOpen={livoCVModal.isOpen}
          onClose={livoCVModal.hideModal}
          livoCVDetails={livoCVModal.livoCVDetails}
        />
      )}
    </section>
  );
};
