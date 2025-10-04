import { FacilityPermission } from '@/services/facility-staff';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';

interface FacilityStaffPermissionCardProps {
  isEnabled: boolean;
  permission: FacilityPermission;
  togglePermission: () => void;
}
export const FacilityStaffPermissionCard: React.FC<
  FacilityStaffPermissionCardProps
> = ({ isEnabled, permission, togglePermission }) => {
  return (
    <div
      onClick={togglePermission}
      className={`flex cursor-pointer items-center space-x-tiny rounded-[8px] p-medium ${isEnabled ? 'ring-2 ring-Primary-500' : ' ring-1 ring-Divider-Default'}`}
    >
      <div className="w-full">
        <p className="body-regular">{permission.title}</p>
        <p className="info-caption text-Text-Subtle">
          {permission.description}
        </p>
      </div>
      <div onClick={togglePermission} className="items-center justify-center">
        <LivoIcon
          name={isEnabled ? 'square-check-filled' : 'square'}
          size={24}
          color={colors[isEnabled ? 'Primary-500' : 'Neutral-300']}
        />
      </div>
    </div>
  );
};
