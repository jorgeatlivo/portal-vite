import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Box, CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { downloadZipFile } from '@/services/api';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { allFalse, allNonEmpty } from '@/utils/utils';

import colors from '@/config/color-palette';
import { AppDispatch } from '@/store';
import { ProfessionalInitProfile, ProfessionalLegalProfile } from '@/types';
import FileThumbnail from './FileThumbnail';

function hasAllRequiredDocuments(
  professionalInitProfile: ProfessionalInitProfile,
  professionalLegalProfile: ProfessionalLegalProfile
): boolean {
  const documentUrls = Object.entries({
    ...professionalInitProfile,
    ...professionalLegalProfile,
  })
    .filter(
      ([key]) =>
        (key.endsWith('Url') || key.endsWith('CV')) &&
        key !== 'socialSecurityNumberDocumentUrl'
    )
    .map(([_, value]) => value as string);
  return (
    allNonEmpty(...documentUrls) &&
    allFalse(professionalLegalProfile.nationalIdDocExpired)
  );
}

interface LegalDocumentationCardProps {
  professionalInitProfile: ProfessionalInitProfile;
  professionalLegalProfile?: ProfessionalLegalProfile;
  shiftClaimId: number;
}

export default function LegalFilesCard({
  professionalInitProfile,
  professionalLegalProfile,
  shiftClaimId,
}: LegalDocumentationCardProps) {
  const { t } = useTranslation('shift-claim-details');
  const [downloadingFile, setDownloadingFile] = React.useState(false);
  const legalDocumentationNotAvailable = (
    <Typography
      gutterBottom
      variant={'body/regular'}
      color={colors['Text-Secondary']}
    >
      {t('unavailable_legal_documentation')}
    </Typography>
  );
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Card
      sx={{
        m: 1,
        minWidth: { md: 600 },
        flex: 1,
      }}
    >
      <CardContent>
        <div className="flex flex-col items-center justify-between gap-2 pb-3 md:flex-row md:pb-0">
          <Typography
            gutterBottom
            variant={'info/caption'}
            color={colors['Text-Secondary']}
          >
            {t('legal_documentation_title')}
          </Typography>
          {downloadingFile ? (
            <div className="flex flex-row items-center px-large">
              <CircularProgress size={24} color="primary" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDownloadingFile(true);
                downloadZipFile(shiftClaimId)
                  .then(() => {
                    setDownloadingFile(false);
                  })
                  .catch(() => {
                    setDownloadingFile(false);
                    dispatch(
                      showToastAction({
                        message: t('download_all_error'),
                        severity: 'error',
                      })
                    );
                  });
              }}
              className="ring-solid flex flex-row items-center gap-2 rounded-[100px] py-small pl-medium pr-large ring-1 ring-Primary-500"
            >
              <Typography variant="body/regular" color={colors['Primary-500']}>
                {t('download_all_files')}
              </Typography>
              <LivoIcon
                name={'download'}
                size={16}
                color={colors['Primary-500']}
              />
            </button>
          )}
        </div>
        {professionalLegalProfile ? (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            {!hasAllRequiredDocuments(
              professionalInitProfile,
              professionalLegalProfile
            ) && (
              <Typography variant="body/regular">
                {t('uncomplete_documentation_disclaimer')}
              </Typography>
            )}

            <FileThumbnail
              fileUrl={professionalLegalProfile.nationalIdUrl}
              label={t('national_id')}
              isExpired={professionalLegalProfile.nationalIdDocExpired}
            />
            {professionalLegalProfile.socialSecurityNumberDocumentUrl && (
              <FileThumbnail
                fileUrl={
                  professionalLegalProfile.socialSecurityNumberDocumentUrl
                }
                label={t('nuss')}
              />
            )}
            <FileThumbnail
              fileUrl={professionalLegalProfile.noConvictionCertificateUrl}
              label={t('non_conviction_certificate_label')}
            />
            <FileThumbnail
              fileUrl={professionalLegalProfile.paymentReceiptUrl}
              label={t('payment_receipt_label')}
            />
            <FileThumbnail
              fileUrl={professionalLegalProfile.certificateUrl}
              label={t('certificate_label')}
            />
            {professionalLegalProfile.extraCertificateUrl1 && (
              <FileThumbnail
                fileUrl={professionalLegalProfile.extraCertificateUrl1}
                label={t('extra_certificate_1')}
              />
            )}
            {professionalLegalProfile.extraCertificateUrl2 && (
              <FileThumbnail
                fileUrl={professionalLegalProfile.extraCertificateUrl2}
                label={t('extra_certificate_2')}
              />
            )}
            {professionalLegalProfile.extraCertificateUrl3 && (
              <FileThumbnail
                fileUrl={professionalLegalProfile.extraCertificateUrl3}
                label={t('extra_certificate_3')}
              />
            )}
            <FileThumbnail
              fileUrl={professionalInitProfile.professionalCV}
              label={t('curriculum_label')}
            />
            <FileThumbnail
              fileUrl={professionalLegalProfile.bankAccountDocumentUrl}
              label={t('iban_document_label')}
            />
            <FileThumbnail
              fileUrl={professionalLegalProfile.incomeRetentionChangeRequestUrl}
              label={t('deduction_percentage_document_label')}
            />
            <FileThumbnail
              fileUrl={professionalInitProfile.profilePictureUrl}
              label={t('profile_picture_document_label')}
            />
          </Box>
        ) : (
          legalDocumentationNotAvailable
        )}
      </CardContent>
    </Card>
  );
}
