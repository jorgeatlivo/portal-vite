import { useTranslation } from 'react-i18next';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { ClaimRequest } from '@/types/claims';
import { CVType } from '@/types/common/curriculum';

import colors from '@/config/color-palette';

interface ProfessionalDataBodyProps {
  claim: ClaimRequest;
  onViewLivoCV: () => void;
}
export const ProfessionalDataBody: React.FC<ProfessionalDataBodyProps> = ({
  claim,
  onViewLivoCV,
}) => {
  const { t } = useTranslation('professional-claim');
  const hasLivoCV = claim.professionalProfile.availableCVTypes?.includes(
    CVType.LIVO_CV
  );
  const hasPdfUpload = claim.professionalProfile.availableCVTypes?.includes(
    CVType.PDF_UPLOAD
  );

  return (
    <section className="flex w-full flex-col p-medium">
      <div className="mb-large flex flex-row space-x-small">
        <LivoIcon name="id-badge-2" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">
          {t('professional_data_title')}
        </Typography>
      </div>
      {claim.professionalProfile.licenseNumber !== null ? (
        <div className="mb-small flex flex-row flex-wrap space-x-small">
          <Typography variant="body/regular" color={colors['Text-Subtle']}>
            {t('license_number_label')}:
          </Typography>
          <Typography variant="subtitle/regular">
            {claim.professionalProfile.licenseNumber}
          </Typography>
        </div>
      ) : null}
      {(hasLivoCV || hasPdfUpload) && (
        <div className="flex flex-row space-x-2">
          <div className="flex flex-col">
            <Typography variant="body/regular" color={colors['Text-Subtle']}>
              {t('experience_label')}:
            </Typography>
          </div>
          <div className="flex flex-1 shrink flex-col items-start justify-start gap-2 pt-px md:flex-row md:gap-3">
            {hasLivoCV && (
              <Typography
                onClick={onViewLivoCV}
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
                onClick={() =>
                  window.open(
                    claim.professionalProfile.professionalCV,
                    '_blank'
                  )
                }
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
    </section>
  );
};
