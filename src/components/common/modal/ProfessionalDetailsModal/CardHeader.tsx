import { Typography } from '@/components/atoms/Typography';
import { CategoryTag } from '@/components/common/CategoryTag';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import { ProfessionalProfileBrief } from '@/types/professional';

import { ShiftModalityEnum } from '@/types';

interface ProfessionalCardHeaderProps {
  profile?: ProfessionalProfileBrief;
  modality: ShiftModalityEnum | null;
}

export const CardHeader: React.FC<ProfessionalCardHeaderProps> = ({
  profile,
  modality,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-small">
      <ProfilePicture
        profilePictureUrl={profile?.profilePictureUrl}
        modality={modality}
        size={64}
      />
      <div className="flex w-full flex-col items-center gap-2">
        <Typography variant="heading/medium" className="text-Text-Default">
          {getDisplayName(profile)}
        </Typography>

        {profile?.category && (
          <div className="flex items-center gap-2">
            <CategoryTag text={profile.category.acronym} />
            <Typography variant="body/regular" className="text-Text-Subtle">
              {profile.category.displayText}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export function getDisplayName(professional?: ProfessionalProfileBrief) {
  if (!professional) return '--';

  if (professional.secondLastName) {
    return `${professional.lastName} ${professional.secondLastName}, ${professional.firstName} `;
  }
  return `${professional.lastName}, ${professional.firstName}`;
}
