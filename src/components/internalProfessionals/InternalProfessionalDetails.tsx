import { useTranslation } from 'react-i18next';

import { InternalProfessionalAttributes } from '@/components/shiftDetails/professionalClaim/InternalProfileAttributes';

import { Category } from '@/types/common/category';

import { ShiftModalityEnum } from '@/types';
import { ProfessionalCardHeader } from '../../components/shiftDetails/professionalClaim/ProfessionalCardHeader';
import {
  DataFieldSubmission,
  FacilityDataFieldDefinition,
  InternalProfessional,
} from '../../types/internal';
import { EditInternalProfessionalAttributes } from './EditInternalProfessionalAttributes';

interface InternalProfessionalDetailsProps {
  professional: InternalProfessional;
  isEditting: boolean;
  onEdit: (
    newProfessionalDetails: DataFieldSubmission[],
    newCategory: Category,
    newSkills: string[]
  ) => void;
  onCancelEdit: () => void;
  onAcceptProfessional: (
    dataFieldSubmission: DataFieldSubmission[],
    newCategory: Category,
    newSkills: string[]
  ) => void;
  onRejectProfessional: () => void;
  dataFieldDefinitions: FacilityDataFieldDefinition[];
}
export const InternalProfessionalDetails: React.FC<
  InternalProfessionalDetailsProps
> = ({
  professional,
  isEditting,
  onEdit,
  onCancelEdit,
  onAcceptProfessional,
  onRejectProfessional,
  dataFieldDefinitions,
}) => {
  const { t } = useTranslation('internal-professional-page');
  return (
    <div
      className="flex flex-col justify-between pb-large"
      style={{
        height: 'calc(100% - 40px)', // this is to keep space for the header
      }}
    >
      <div className="flex size-full flex-col space-y-large divide-y divide-Divider-Default">
        {professional.invitationStatus === 'PENDING' ? (
          <EditInternalProfessionalAttributes
            internalProfessionalAttributes={professional.dataFields}
            hideIcons={false}
            onAccept={(newProfessionalDetails, newCategory, newSkills) => {
              onAcceptProfessional(
                newProfessionalDetails,
                newCategory,
                newSkills
              );
            }}
            onReject={onRejectProfessional}
            dataFieldDefinitions={dataFieldDefinitions}
            professional={professional}
          />
        ) : isEditting ? (
          <EditInternalProfessionalAttributes
            professional={professional}
            internalProfessionalAttributes={professional.dataFields}
            acceptTitle={t('save_changes_label')}
            rejectTitle={t('cancel_label')}
            hideIcons={true}
            onAccept={(newProfessionalDetails, newCategory, newSkills) => {
              onEdit(newProfessionalDetails, newCategory, newSkills);
            }}
            onReject={onCancelEdit}
            dataFieldDefinitions={dataFieldDefinitions}
          />
        ) : (
          <div
            className="no-scrollbar flex w-full  flex-col overflow-y-scroll"
            style={{
              height: 'auto',
            }}
          >
            <ProfessionalCardHeader
              professionalProfile={professional}
              modality={ShiftModalityEnum.INTERNAL}
            />

            <InternalProfessionalAttributes
              attributes={[
                ...professional.dataFields
                  .filter((datafield) => datafield.key !== 'NATIONAL_ID')
                  .map((datafield) => ({
                    label: datafield.label,
                    value: datafield.displayText,
                  })),
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
