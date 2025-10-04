import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import FavoriteProfessionalCard from '@/components/professionals/FavoriteProfessionalCard';

import { ProfessionalProfile } from '@/types/claims';

import colors from '@/config/color-palette';

interface ProfessionalFacilityExperienceProps {
  professionalProfile: ProfessionalProfile;
  shiftId?: number;
  claimId?: number;
}

export const ProfessionalFacilityExperience: React.FC<
  ProfessionalFacilityExperienceProps
> = ({ professionalProfile, shiftId, claimId }) => {
  const { t } = useTranslation('professional-claim');
  const account = useSelector((state: RootState) => state.account);
  return (
    <div className="flex w-full flex-col p-medium">
      <div className="mb-large flex flex-row gap-2">
        <LivoIcon name="report-medical" size={24} color={colors['Grey-400']} />
        <Typography variant="body/regular">
          {t('facility_experience')}
        </Typography>
      </div>
      <div className="ring-solid flex w-full flex-row items-center rounded-[8px] bg-white px-small py-medium ring-1 ring-Divider-Subtle">
        <div className="mr-small flex w-full flex-col">
          <Typography variant="subtitle/regular">
            {t('completed_shifts')}
          </Typography>
          {account.accountInfo && (
            <Typography variant="body/regular" color={colors['Text-Subtle']}>
              {t('in')} {account.accountInfo.facility.name}
            </Typography>
          )}
        </div>
        <div className="flex">
          {professionalProfile.firstShifterForFacility ? (
            <Typography
              variant="heading/small"
              color={colors['Purple-500']}
              className="text-nowrap "
            >
              {t('first_shifter_label')}
            </Typography>
          ) : (
            <Typography variant="heading/small">
              {professionalProfile.totalShiftsInFacility.totalShiftsInFacility}
            </Typography>
          )}
        </div>
      </div>
      <FavoriteProfessionalCard
        professionalProfile={professionalProfile}
        shiftId={shiftId}
        claimId={claimId}
        className="ring-solid mt-large rounded-[8px] ring-1 ring-Divider-Subtle"
      />
    </div>
  );
};
