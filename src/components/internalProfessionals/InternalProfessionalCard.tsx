import clsx from 'clsx';

import { Typography } from '@/components/atoms/Typography';
import { CategoryTag } from '@/components/common/CategoryTag';
import { NotificationsBadge } from '@/components/common/NotificationsBadge';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import {
  FacilityDataFieldDefinition,
  InternalProfessional,
  internalProfessionalDisplayName,
} from '@/types/internal';

import colors from '@/config/color-palette';
import { TagLabelRow } from '../common/TagLabelRow';

interface InternalProfessionalCardProps {
  professional: InternalProfessional;
  isSelected?: boolean;
  onClick?: () => void;
  notifications?: number;
  dataFieldDefinitions: FacilityDataFieldDefinition[];
}

export const InternalProfessionalCard: React.FC<
  InternalProfessionalCardProps
> = ({
  professional,
  isSelected,
  onClick,
  notifications,
  dataFieldDefinitions,
}) => {
  const numberOfDataFields = dataFieldDefinitions.length + 2;
  const gridCols = `grid-cols-${numberOfDataFields}`;
  const labelColor = isSelected
    ? colors['Neutral-000']
    : colors['Text-Default'];

  return (
    <div
      onClick={onClick}
      className={clsx(
        `relative flex  min-w-[200px] flex-row items-center overflow-hidden rounded-[8px] p-small shadow-sm hover:shadow-md`,
        isSelected ? 'bg-Action-Secondary text-Text-Inverse' : 'bg-white',
        onClick && 'cursor-pointer'
      )}
    >
      <div
        className={`grid flex-1 ${gridCols} items-center justify-between space-x-small`}
      >
        <div
          className={`col-span-2 flex items-center space-x-small text-nowrap text-left`}
        >
          <ProfilePicture
            profilePictureUrl={professional.profilePictureUrl}
            size={36}
            modality={null}
          />
          {professional.category ? (
            <CategoryTag text={professional.category.acronym} />
          ) : null}
          <Typography
            variant="subtitle/small"
            color={labelColor}
            title={internalProfessionalDisplayName(professional)}
          >
            {internalProfessionalDisplayName(professional)}
          </Typography>
        </div>
        {dataFieldDefinitions.map((dataFieldDefinition) => {
          const selectedValue = professional.dataFields.find(
            (dataField) => dataField.key === dataFieldDefinition.key
          )?.displayText;
          const multiSelectOption = dataFieldDefinition.options.map(
            (option) => option.value
          );
          return (
            <div
              key={dataFieldDefinition.key}
              className="col-span-1 flex text-nowrap text-left"
              title={selectedValue?.split(', ').join('\n') || '-'} // Tooltip with full text
            >
              {dataFieldDefinition.key === 'MULTI_SELECT' && selectedValue ? (
                <TagLabelRow tags={multiSelectOption} small />
              ) : (
                <Typography
                  variant="body/small"
                  color={labelColor}
                  textOverflow={'ellipsis'}
                  maxLines={2}
                >
                  {selectedValue || '-'}
                </Typography>
              )}
            </div>
          );
        })}
      </div>
      <div className="w-xLarge">
        {notifications && <NotificationsBadge notifications={notifications} />}
      </div>
    </div>
  );
};
