import { useTranslation } from 'react-i18next';

import { FacilityPermission } from '@/services/facility-staff';

import { TogglerOff } from '@/components/common/TogglerOff';
import { TogglerOn } from '@/components/common/TogglerOn';

import { FacilityStaffPermissionCard } from './FacilityStaffPermissionCard';

interface FacilityStaffPermissionsComponentProps {
  permissions: string[];
  togglePermission: (permission: string) => void;
  permissionList: FacilityPermission[];
  toggleAdmin: () => void;
  isAdmin: boolean;
}

export const FacilityStaffPermissionsComponent: React.FC<
  FacilityStaffPermissionsComponentProps
> = ({
  permissions,
  togglePermission,
  permissionList,
  toggleAdmin,
  isAdmin,
}) => {
  const { t } = useTranslation('facility-staff');
  return (
    <div>
      <p className="subtitle-regular">{t('permissions_label')}</p>
      <div className="flex items-center justify-between space-x-small py-small">
        <p className="body-regular">{t('admin_permissions_text')}</p>

        <div onClick={toggleAdmin} className="cursor-pointer">
          {isAdmin ? <TogglerOn /> : <TogglerOff />}
        </div>
      </div>
      <div className="w-full space-y-small py-medium">
        {permissionList.map((permission, index) => (
          <FacilityStaffPermissionCard
            key={index}
            isEnabled={permissions.includes(permission.value)}
            permission={permission}
            togglePermission={() => togglePermission(permission.value)}
          />
        ))}
      </div>
    </div>
  );
};
