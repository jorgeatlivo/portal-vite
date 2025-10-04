import { useState } from 'react';

import clsx from 'clsx';

import { FacilityStaff } from '@/services/facility-staff';

import { Typography } from '@/components/atoms/Typography';
import LivoIcon from '@/components/common/LivoIcon';
import { TagLabelRow } from '@/components/common/TagLabelRow';

import colors from '@/config/color-palette';

interface FacilityStaffCardProps {
  staff: FacilityStaff;
  onClick: () => void;
  facilityHasUnitsConfigured?: boolean;
}

export const FacilityStaffCard: React.FC<FacilityStaffCardProps> = ({
  staff,
  onClick,
  facilityHasUnitsConfigured,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const gridColumnsStyle = facilityHasUnitsConfigured
    ? 'grid-cols-5'
    : 'grid-cols-4';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex min-w-[200px]  cursor-pointer flex-row items-center rounded-[8px] bg-white p-small shadow-sm hover:shadow-md`}
    >
      <div
        className={`grid flex-1 ${gridColumnsStyle} w-full items-center justify-between space-x-small`}
      >
        <div className="col-span-1 flex text-left">
          <Typography variant="subtitle/small">
            {staff.firstName} {staff.lastName}
          </Typography>
        </div>
        <div className="col-span-1 flex text-nowrap text-left">
          <Typography variant="body/small">{staff.email}</Typography>
        </div>
        {facilityHasUnitsConfigured ? (
          <div className="col-span-1 flex justify-start">
            <TagLabelRow
              small
              tags={staff.units.map((unit) => unit.displayName)}
            />
          </div>
        ) : null}

        <div className="col-span-2 flex">
          <TagLabelRow
            small
            tags={staff.permissions.map((perm) => perm.tabText)}
          />
        </div>
      </div>
      <div
        className={clsx(
          'ml-small cursor-pointer rounded-full bg-Primary-500 p-tiny transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <LivoIcon name="pencil" size={16} color={colors['Primary-100']} />
      </div>
    </div>
  );
};
