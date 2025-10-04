import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Avatar, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { IconUser } from '@tabler/icons-react';

import { showToastAction } from '@/store/actions/appConfigurationActions';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { AppDispatch } from '@/store';
import { ProfessionalInitProfile, ProfessionalLegalProfile } from '@/types';
import BoldTitleAndValue from './common/BoldTitleAndValue';
import FirstShifterTag from './common/FirstShifterTag';

export default function ProfessionalProfileCard({
  professionalInitProfile,
  professionalLegalProfile,
}: {
  professionalInitProfile: ProfessionalInitProfile;
  professionalLegalProfile?: ProfessionalLegalProfile;
}) {
  const { t } = useTranslation(['shift-claim-details', 'shift-claim-list']);
  const dispatch = useDispatch<AppDispatch>();

  const BoxRow = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>{children}</Box>
  );
  const legalDocumentationNotAvailable = (
    <Typography
      variant="body/regular"
      color={colors['Text-Secondary']}
      gutterBottom
    >
      {t('unavailable_legal_information')}
    </Typography>
  );

  const deductionPercentage = professionalLegalProfile?.deductionPercentage
    ? professionalLegalProfile.deductionPercentage.toString() + '%'
    : '';
  const fieldsToCopy = t('copy_professional_fields', {
    firstName: professionalInitProfile.firstName || '',
    lastName: professionalInitProfile.lastName || '',
    secondLastName: professionalInitProfile.secondLastName || '',
    phoneNumber: professionalInitProfile.phoneNumber || '',
    email: professionalInitProfile.email || '',
    licenseNumber: professionalInitProfile.licenseNumber || '',
    hasLegalProfile: !!professionalLegalProfile,
    nationalId: professionalLegalProfile?.nationalId || '',
    address: professionalLegalProfile?.address || '',
    bankAccountNumber: professionalLegalProfile?.bankAccountNumber || '',
    deductionPercentage: deductionPercentage,
    socialSecurityNumber: professionalLegalProfile?.socialSecurityNumber || '',
  });

  const legalDocumentation = professionalLegalProfile && (
    <div>
      <Typography variant={'heading/regular'} sx={{ mb: 2, fontSize: 20 }}>
        {t('legal_information_title')}
      </Typography>
      <BoxRow>
        <BoldTitleAndValue
          title={t('national_id')}
          value={professionalLegalProfile.nationalId}
          placeholder={t('shift-claim-list:pending_label')}
          annotation={
            professionalLegalProfile.nationalIdDocExpired
              ? t('expired_document_label')
              : undefined
          }
          copyText={professionalLegalProfile.nationalId}
          copyTextSuccess={t('national_id_copied')}
        />
      </BoxRow>
      <BoxRow>
        <BoldTitleAndValue
          title={t('address_label')}
          value={professionalLegalProfile.address}
          placeholder={t('shift-claim-list:pending_label')}
          copyText={professionalLegalProfile.address}
          copyTextSuccess={t('address_copied')}
        />
      </BoxRow>
      <BoxRow>
        <BoldTitleAndValue
          title={t('bank_account_number_label')}
          value={professionalLegalProfile.bankAccountNumber}
          placeholder={t('shift-claim-list:pending_label')}
          copyText={professionalLegalProfile.bankAccountNumber}
          copyTextSuccess={t('bank_account_number_copied')}
        />
      </BoxRow>
      <BoxRow>
        <BoldTitleAndValue
          title={t('deduction_percentage_label')}
          value={deductionPercentage}
          placeholder={t('shift-claim-list:pending_label')}
          copyText={deductionPercentage}
          copyTextSuccess={t('deduction_percentage_copied')}
        />
      </BoxRow>
      <BoxRow>
        <BoldTitleAndValue
          title={t('social_security_number_label')}
          value={professionalLegalProfile.socialSecurityNumber}
          placeholder={t('shift-claim-list:pending_label')}
          copyText={professionalLegalProfile.socialSecurityNumber}
          copyTextSuccess={t('social_security_number_copied')}
        />
      </BoxRow>
    </div>
  );
  return (
    <Card sx={{ m: 1, flex: 1, minWidth: { md: 400 } }}>
      <CardContent>
        <div className="flex flex-col items-center justify-between gap-2 pb-3 md:flex-row md:pb-0">
          <Typography
            gutterBottom
            variant={'info/caption'}
            color={colors['Text-Secondary']}
          >
            {t('professional_profile_title')}
          </Typography>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(fieldsToCopy);
              dispatch(
                showToastAction({
                  message: t('copy_field_success') as string,
                  severity: 'success',
                })
              );
            }}
            className="ring-solid flex flex-row items-start gap-2 rounded-[100px] py-small pl-medium pr-large ring-1 ring-Primary-500 md:items-center"
          >
            <Typography variant="body/regular" color={colors['Primary-500']}>
              {t('copy_all_fields')}
            </Typography>
            <LivoIcon size={16} name={'copy'} color={colors['Primary-500']} />
          </button>
        </div>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}
          >
            <Avatar
              src={professionalInitProfile.profilePictureUrl}
              sx={{ width: 70, height: 70, marginBottom: 2, mr: 2 }}
            >
              {professionalInitProfile.profilePictureUrl ? null : (
                <IconUser size={36} color={colors['Text-Subtle']} />
              )}
            </Avatar>
            <Box>
              <Typography variant={'subtitle/regular'} component="div">
                {professionalInitProfile.firstName}{' '}
                {professionalInitProfile.lastName}{' '}
                {professionalInitProfile.secondLastName}
              </Typography>
              {professionalInitProfile.firstShifter && <FirstShifterTag />}
              {professionalInitProfile.licenseNumber !== null ? (
                <BoldTitleAndValue
                  title={t('license_number_label')}
                  value={professionalInitProfile.licenseNumber}
                  placeholder={t('shift-claim-list:pending_label')}
                />
              ) : null}
              {professionalLegalProfile && (
                <BoldTitleAndValue
                  title={t('national_id')}
                  value={professionalLegalProfile.nationalId}
                  placeholder={t('shift-claim-list:pending_label')}
                  annotation={
                    professionalLegalProfile.nationalIdDocExpired
                      ? t('expired_document_label')
                      : undefined
                  }
                  copyText={professionalLegalProfile.nationalId}
                  copyTextSuccess={t('national_id_copied')}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant={'heading/regular'} sx={{ mb: 2, fontSize: 20 }}>
            {t('contact_information_label')}
          </Typography>
          <BoxRow>
            <BoldTitleAndValue
              title={t('email_label')}
              value={professionalInitProfile.email}
              copyText={professionalInitProfile.email}
              copyTextSuccess={t('email_copied')}
            />
          </BoxRow>
          <BoxRow>
            <BoldTitleAndValue
              title={t('phone_number_label')}
              value={professionalInitProfile.phoneNumber}
              copyText={professionalInitProfile.phoneNumber}
              copyTextSuccess={t('phone_number_copied')}
            />
          </BoxRow>
        </Box>
        {professionalLegalProfile
          ? legalDocumentation
          : legalDocumentationNotAvailable}
      </CardContent>
    </Card>
  );
}
