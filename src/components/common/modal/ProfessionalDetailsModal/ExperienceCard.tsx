import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { RootState } from '@/store/types';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';

import { ProfessionalProfileBrief } from '@/types/professional';

import colors from '@/config/color-palette';

interface ExperienceCardProps {
  profile: ProfessionalProfileBrief;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  profile: professionalProfile,
}) => {
  const { t } = useTranslation('professional-claim');
  const account = useSelector((state: RootState) => state.account);
  return (
    <Box className="flex w-full flex-col p-medium">
      <Box className="mb-large flex flex-row gap-2">
        <LivoIcon name="report-medical" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">
          {t('facility_experience')}
        </Typography>
      </Box>
      <div className="flex w-full flex-row items-center rounded-lg border border-Divider-Subtle bg-white px-large py-medium">
        <div className="mr-small flex w-full flex-col p-0">
          <Typography variant="subtitle/regular">
            {t('completed_shifts')}
          </Typography>
          {account.accountInfo && (
            <Typography variant="body/regular" className="text-Text-Subtle">
              {t('in')} {account.accountInfo.facility.name}
            </Typography>
          )}
        </div>
        <Box className="flex">
          {professionalProfile.firstShifterForFacility ? (
            <Typography
              variant="heading/small"
              className="text-nowrap text-Purple-500"
            >
              {t('first_shifter_label')}
            </Typography>
          ) : (
            <Typography variant="heading/small">
              {professionalProfile.totalShiftsInFacility}
            </Typography>
          )}
        </Box>
      </div>
    </Box>
  );
};
