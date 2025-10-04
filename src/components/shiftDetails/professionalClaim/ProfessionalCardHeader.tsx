import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import { Typography } from '@/components/atoms/Typography';
import { CategoryTag } from '@/components/common/CategoryTag';
import LivoIcon from '@/components/common/LivoIcon';

import { ProfessionalProfile } from '@/types/claims';
import {
  InternalProfessional,
  internalProfessionalDisplayName,
} from '@/types/internal';
import { formatPhoneNumber } from '@/utils/utils';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { ProfilePicture } from '../ProfilePicture';

interface ProfessionalCardHeaderProps {
  professionalProfile: ProfessionalProfile | InternalProfessional;
  modality: ShiftModalityEnum | null;
}

export const ProfessionalCardHeader: React.FC<ProfessionalCardHeaderProps> = ({
  professionalProfile,
  modality,
}) => {
  const { t } = useTranslation('professionals/profile');
  const accountInfo = useSelector(
    (state: RootState) => state.account.accountInfo
  );

  function getNationalIdField() {
    return 'dataFields' in professionalProfile
      ? professionalProfile.dataFields.find(
          (field: { key: string }) => field.key === 'NATIONAL_ID'
        )
      : undefined;
  }

  function displayName(
    professional: ProfessionalProfile | InternalProfessional
  ) {
    if ('dataFields' in professional) {
      return internalProfessionalDisplayName(professional);
    }
    return `${professional.firstName}, ${professional.lastName}`;
  }

  function shouldDisplayNationalId() {
    return (
      'dataFields' in professionalProfile &&
      accountInfo?.facility.livoInternalOnboardingStrategy ===
        'DENARIO_INTEGRATED'
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-small">
      <ProfilePicture
        profilePictureUrl={professionalProfile?.profilePictureUrl}
        modality={modality}
        size={64}
      />
      <div className="flex w-full flex-col items-center">
        <Typography variant="heading/medium">
          {displayName(professionalProfile)}
        </Typography>

        {professionalProfile.category || professionalProfile.skills ? (
          <div className="flex w-full flex-col space-y-large p-medium">
            {shouldDisplayNationalId() && (
              <>
                <div className="flex flex-row space-x-small">
                  <LivoIcon name="user" size={24} color={colors['Grey-400']} />
                  <Typography variant="body/regular">
                    {t('personal_data_label')}
                  </Typography>
                </div>
                <div className="flex items-center space-x-small">
                  <div className="flex w-full flex-row items-start justify-between space-x-small">
                    <Typography
                      variant="body/regular"
                      color={colors['Text-Subtle']}
                    >
                      {t('phone_label')}:
                    </Typography>

                    <p className="subtitle-regular text-clip text-right text-Text-Default">
                      {formatPhoneNumber(professionalProfile.phoneNumber)}
                    </p>
                  </div>
                </div>

                {'email' in professionalProfile && (
                  <div className="flex items-center space-x-small">
                    <div className="flex w-full flex-row items-start justify-between space-x-small">
                      <Typography
                        variant="body/regular"
                        color={colors['Text-Subtle']}
                      >
                        {t('email_label')}:
                      </Typography>

                      <p className="subtitle-regular text-clip text-right text-Text-Default">
                        {professionalProfile.email || t('missing_email_label')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-small">
                  <div className="flex w-full flex-row items-start justify-between space-x-small">
                    <Typography
                      variant="body/regular"
                      color={colors['Text-Subtle']}
                    >
                      {t('national_id_label')}:
                    </Typography>
                    <p className="subtitle-regular text-clip text-right text-Text-Default">
                      {getNationalIdField()?.value}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-row space-x-small">
              <LivoIcon
                size={24}
                name="stethoscope"
                color={colors['Grey-400']}
              />
              <Typography variant="body/regular">
                {professionalProfile.category
                  ? t('category_section_label')
                  : t('skills_section_label')}
              </Typography>
            </div>
            {professionalProfile.category ? (
              <div className="flex items-center space-x-small">
                <CategoryTag text={professionalProfile.category.acronym} />
                <Typography
                  variant="body/regular"
                  color={colors['Text-Subtle']}
                >
                  {professionalProfile.category.displayText}
                </Typography>
              </div>
            ) : null}
            {professionalProfile.skills ? (
              <div className="flex flex-row items-start justify-between space-x-small">
                <Typography
                  variant="body/regular"
                  color={colors['Text-Subtle']}
                >
                  {t('skills_label')}:
                </Typography>
                <Typography
                  variant="subtitle/regular"
                  className="text-clip text-right"
                >
                  {professionalProfile.skills.professionalSkills
                    .map(
                      (skill) =>
                        professionalProfile.skills.skillDefinitions.find(
                          (skillDefinition) => skillDefinition.value === skill
                        )?.displayText
                    )
                    .join(', ')}
                </Typography>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
