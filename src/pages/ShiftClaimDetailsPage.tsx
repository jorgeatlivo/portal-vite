import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Tooltip,
} from '@mui/material';
import { IconFileSpreadsheet } from '@tabler/icons-react';

import {
  confirmRequest,
  fetchContactInfo,
  fetchLegalReviewDetails,
} from '@/services/api';
import { Logger } from '@/services/logger.service';
import { showToastAction } from '@/store/actions/appConfigurationActions';

import { Typography } from '@/components/atoms/Typography';
import LegalFilesCard from '@/components/LegalFilesCard';
import ProfessionalProfileCard from '@/components/ProfessionalProfileCard';
import ShiftInformationCard from '@/components/ShiftInformationCard';

import { useNestedPage } from '@/hooks/use-nested-page';
import {
  FacilityReviewStatusEnum,
  getReviewStatusLabelProps,
  getStatusStyle,
} from '@/utils/constants';
import { useUncaughtErrorHandler } from '@/utils/uncaughtError';

import colors from '@/config/color-palette';
import { ReturnButtonHeader } from '@/pages/shared/ShiftForm/components/ReturnButtonHeader';
import { ShiftClaimDetails } from '@/types';

import '../styles/ShiftClaimDetails.css';

import clsx from 'clsx';

interface Props {
  onConfirmClaim?: () => void;
}

export const ShiftClaimDetailsPage: React.FC<Props> = ({ onConfirmClaim }) => {
  const { t } = useTranslation(['shift-claim-details', 'shift-claim-list']);

  const {
    isOpenPage,
    isVisible,
    relatedParamValue: id,
    goBack,
  } = useNestedPage('check-claim', 'id');

  const [loading, setLoading] = useState(true);
  const [shiftClaimDetails, setShiftClaimDetails] =
    useState<ShiftClaimDetails | null>(null);
  const { handleUncaughtError } = useUncaughtErrorHandler();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const fetchShiftClaimDetails = async () => {
    setLoading(true);
    await fetchContactInfo()
      .then((contactInfo) => setEmail(contactInfo.email))
      .catch((error) => {
        handleUncaughtError(error, t('error_contact_info'));
        Logger.error('Error on fetch contact info', error);
      });
    await fetchLegalReviewDetails(+id!)
      .then((shiftClaimDetails) => {
        setShiftClaimDetails(shiftClaimDetails);
        setLoading(false);
      })
      .catch(() => {
        setShiftClaimDetails(null);
        setLoading(false);
      });
  };

  const handleConfirmClick = async () => {
    confirmRequest(shiftClaimDetails!.shiftClaimId)
      .then(() => {
        dispatch(
          showToastAction({
            message: t('confirmation_success_message'),
            severity: 'success',
          })
        );
        fetchShiftClaimDetails();
        onConfirmClaim?.();
      })
      .catch((error) => {
        handleUncaughtError(error, t('confirmation_error_message'));
        Logger.error('Error on confirm shift claim', error);
      });
  };

  useEffect(() => {
    fetchShiftClaimDetails();
  }, [id]);

  const reviewStatusLabelProps = useMemo(() => getReviewStatusLabelProps(), []);

  const statusLabelProp =
    reviewStatusLabelProps[
      shiftClaimDetails?.facilityReviewStatus as keyof typeof reviewStatusLabelProps
    ];

  const shiftClaimSubtitle =
    shiftClaimDetails !== null ? `${statusLabelProp.label}` : '';

  const shiftClaimDetailsComponent =
    shiftClaimDetails !== null ? (
      <>
        <Box
          sx={{
            flexDirection: 'column',
            display: 'flex',
            my: 2,
            mb: 3,
          }}
        >
          <ShiftInformationCard
            claim={shiftClaimDetails!}
            rightHeader={
              shiftClaimDetails?.facilityReviewStatus ===
              FacilityReviewStatusEnum.IN_REVIEW ? (
                <Button
                  color="success"
                  variant="contained"
                  onClick={handleConfirmClick}
                  size="medium"
                >
                  {t('shift-claim-list:process_documentation_button')}
                </Button>
              ) : undefined
            }
          />
          <Box
            sx={{
              flex: 1,
              flexDirection: { xs: 'column', md: 'row' },
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <ProfessionalProfileCard
              professionalInitProfile={
                shiftClaimDetails!.professionalInitProfile
              }
              professionalLegalProfile={
                shiftClaimDetails!.professionalLegalProfile
              }
            />
            <LegalFilesCard
              professionalInitProfile={
                shiftClaimDetails!.professionalInitProfile
              }
              professionalLegalProfile={
                shiftClaimDetails!.professionalLegalProfile
              }
              shiftClaimId={shiftClaimDetails!.shiftClaimId}
            />
          </Box>
          {email && (
            <Card sx={{ m: 1 }}>
              <CardContent>
                <Typography
                  variant="heading/regular"
                  component="div"
                  gutterBottom
                >
                  {t('contact_label')}
                </Typography>
                <Typography
                  variant={'body/regular'}
                  color={colors['Text-Secondary']}
                >
                  {t('contact_info')}&nbsp;
                  <a href={`mailto:${email}`}>{email}</a>
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </>
    ) : (
      <Card>
        <CardContent>
          <Typography
            gutterBottom
            variant="body/regular"
            color={colors['Text-Secondary']}
          >
            {t('unavailable_shift_message')}
          </Typography>
        </CardContent>
      </Card>
    );

  return isOpenPage && id ? (
    <div
      className={clsx(
        'no-scrollbar absolute inset-0 z-[5] flex w-full flex-col items-center overflow-y-scroll bg-BG-Default transition-transform duration-300',
        isVisible ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <Container sx={{ pb: 2, height: '100vh' }}>
        <ReturnButtonHeader goBack={goBack} title={t('page_title')}>
          <Chip
            label={shiftClaimSubtitle}
            sx={{
              backgroundColor: getStatusStyle(
                shiftClaimDetails?.facilityReviewStatus
              ).bg,
              color: getStatusStyle(shiftClaimDetails?.facilityReviewStatus)
                .text,
              borderRadius: '16px',
              height: '32px',
              px: 1.5,
              fontSize: '1rem',
            }}
          />
          {shiftClaimDetails?.hrIntegrationProcessedTime !== null && (
            <Tooltip
              title={
                shiftClaimDetails?.hrIntegrationProcessedTime
                  ? t('shift-claim-list:exported_to_csv', {
                      date: shiftClaimDetails?.hrIntegrationProcessedTime,
                    })
                  : ''
              }
            >
              <IconFileSpreadsheet
                size={32}
                className="rounded-full border-2 bg-white p-1"
              />
            </Tooltip>
          )}
        </ReturnButtonHeader>
        {loading ? (
          <Container
            sx={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              minHeight: '30em',
              minWidth: '100%',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Container>
        ) : (
          shiftClaimDetailsComponent
        )}
      </Container>
    </div>
  ) : null;
};
