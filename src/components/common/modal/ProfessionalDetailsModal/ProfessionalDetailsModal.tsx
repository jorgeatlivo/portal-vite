import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CircularProgress, IconButton, Stack } from '@mui/material';
import { IconIdBadge2, IconX } from '@tabler/icons-react';

import { Typography } from '@/components/atoms/Typography';
import { CardHeader } from '@/components/common/modal/ProfessionalDetailsModal/CardHeader';
import { ExperienceCard } from '@/components/common/modal/ProfessionalDetailsModal/ExperienceCard';
import FavoriteCard from '@/components/common/modal/ProfessionalDetailsModal/FavoriteCard';
import { ProfessionalCVSummary } from '@/components/shiftDetails/professionalClaim/ProfessionalCVSummary';
import { ProfessionalLivoReviews } from '@/components/shiftDetails/professionalClaim/ProfessionalLivoReviews';

import { useModal } from '@/hooks/use-modal';

import colors from '@/config/color-palette';
import { useProfessionalProfile } from './hooks/useProfessionalProfile';

interface ProfessionalDetailsModalProps {
  professionalId: number;
}

function ProfessionalDetailsModal({
  professionalId,
}: ProfessionalDetailsModalProps) {
  const { closeModal } = useModal();
  const { t } = useTranslation('professional-claim');
  const { professionalProfile, isLoading } =
    useProfessionalProfile(professionalId);

  return (
    <div className="flex w-full flex-col justify-between gap-4 p-6">
      <div className="absolute right-4 top-4">
        <IconButton onClick={closeModal} size="medium">
          <IconX size={24} />
        </IconButton>
      </div>

      {isLoading || !professionalProfile ? (
        <div className="flex size-96 items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="no-scrollbar mt-6 flex h-full flex-col gap-2 overflow-y-auto">
          <div className="flex w-full flex-col">
            <CardHeader
              profile={professionalProfile}
              modality={professionalProfile.modality || null}
            />
          </div>

          {professionalProfile?.cvSummary && (
            <ProfessionalCVSummary cvSummary={professionalProfile.cvSummary} />
          )}

          <div className="flex w-full flex-col gap-4 p-medium">
            <Stack direction={'row'} gap={1}>
              <IconIdBadge2 size={24} color={colors['Grey-400']} />
              <Typography variant="body/regular">
                {t('professional_data_title')}
              </Typography>
            </Stack>

            <Stack direction={'column'} gap={1}>
              {/* LICENSE */}
              <Stack direction={'row'} justifyContent="space-between">
                <Typography variant="body/regular" className="text-Text-Subtle">
                  {t('license_number_label')}:
                </Typography>
                <Typography
                  variant="subtitle/regular"
                  className="text-clip text-right"
                >
                  {professionalProfile?.licenseNumber}
                </Typography>
              </Stack>

              {/* EXPERIENCE */}
              <Stack direction={'row'} justifyContent="space-between">
                <Typography variant="body/regular" className="text-Text-Subtle">
                  {t('experience_label')}:
                </Typography>
                {/* wrap Typo By Link */}
                <Link
                  to={professionalProfile?.professionalCV}
                  target="_blank"
                  rel="noreferrer"
                  className="text-Action-Primary hover:underline"
                >
                  <Typography
                    variant="action/regular"
                    className="text-clip text-right text-Action-Primary"
                    onClick={() => {
                      const cv = professionalProfile?.professionalCV;
                      if (cv) {
                        window.open(cv, '_blank');
                      }
                    }}
                  >
                    {t('view_livo_cv_label')}
                  </Typography>
                </Link>
              </Stack>

              <FavoriteCard
                profile={professionalProfile}
                className="mt-4 rounded-lg border border-Divider-Subtle"
              />
            </Stack>
          </div>

          <ExperienceCard profile={professionalProfile} />

          {!!professionalProfile.professionalReview?.averageRating && (
            <>
              <hr className="w-full border-t border-Divider-Default" />
              <ProfessionalLivoReviews
                review={professionalProfile.professionalReview}
                noPadding={false}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfessionalDetailsModal;
