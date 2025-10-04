import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { RootState } from '@/store/types';

import { Category } from '@/types/common/category';

import colors from '@/config/color-palette';
import { ManageClaimContainer } from '../../components/shiftDetails/professionalClaim/ManageClaimContainer';
import { ProfessionalDataField } from '../../types/claims';
import {
  DataFieldSubmission,
  FacilityDataFieldDefinition,
  InternalProfessional,
} from '../../types/internal';
import LivoIcon from '../common/LivoIcon';
import { EditProfessionalCardHeader } from './EditProfessionalCardHeader';
import { FacilityDataField } from './FacilityDataField';

interface EditInternalProfessionalAttributesProps {
  internalProfessionalAttributes: ProfessionalDataField[];
  acceptTitle?: string;
  rejectTitle?: string;
  hideIcons?: boolean;
  onAccept: (
    newAttributes: DataFieldSubmission[],
    newCategory: Category,
    newSkills: string[]
  ) => void;
  onReject: () => void;
  dataFieldDefinitions: FacilityDataFieldDefinition[];
  professional: InternalProfessional;
}

export const EditInternalProfessionalAttributes: React.FC<
  EditInternalProfessionalAttributesProps
> = ({
  internalProfessionalAttributes,
  acceptTitle,
  rejectTitle,
  hideIcons,
  onAccept,
  onReject,
  dataFieldDefinitions,
  professional,
}) => {
  const { t } = useTranslation('professional-claim');
  const attributesFromDetails = internalProfessionalAttributes.map(
    (attribute) => ({
      key: attribute.key,
      selectedValues: attribute.values?.length
        ? attribute.values.map((value) => value.value)
        : [attribute.value],
      editable: attribute.editable,
    })
  );
  const [dataFieldSubmissions, setDataFieldSubmissions] = useState<
    DataFieldSubmission[]
  >(attributesFromDetails);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    professional.category
  );
  const validEntry =
    dataFieldSubmissions.length === dataFieldDefinitions.length &&
    dataFieldSubmissions.every(
      (attribute) => attribute.selectedValues.length > 0
    );
  const accountInfo = useSelector(
    (state: RootState) => state.account.accountInfo
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    professional.skills?.professionalSkills || []
  );
  const personalDataFieldKeys = ['NATIONAL_ID'];
  const [appliedDenarioProfessionalData, setAppliedDenarioProfessionalData] =
    useState<Boolean>(false);

  function getPersonalDataFields() {
    // National id data field will be render in the header
    return dataFieldDefinitions.filter((dataField) =>
      personalDataFieldKeys.includes(dataField.key)
    );
  }

  function getExtraDataFields() {
    return dataFieldDefinitions.filter(
      (dataField) => !personalDataFieldKeys.includes(dataField.key)
    );
  }

  return (
    <div className="relative flex size-full flex-col py-medium">
      <div className="no-scrollbar flex w-full flex-1 flex-col  overflow-y-scroll p-medium">
        <EditProfessionalCardHeader
          professionalProfile={professional}
          modality={null}
          selectedCategory={selectedCategory}
          availableCategories={accountInfo?.facility.categories || []}
          setSelectedCategory={setSelectedCategory}
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          personalDataFieldDefinitions={getPersonalDataFields()}
          dataFieldSubmissions={dataFieldSubmissions}
          setDataFieldSubmissions={setDataFieldSubmissions}
          appliedDenarioProfessionalData={appliedDenarioProfessionalData}
          setAppliedDenarioProfessionalData={setAppliedDenarioProfessionalData}
        />

        <div className="flex w-full flex-col pb-[100px]">
          <div className="mb-large flex flex-row space-x-small">
            <LivoIcon name="id-badge-2" size={24} color={colors['Grey-400']} />
            <p className="body-regular">{t('professional_data_title')}</p>
          </div>
          <div className="flex flex-col space-y-large">
            {getExtraDataFields().map((dataField, index) => {
              const originalAttribute = attributesFromDetails.find(
                (attribute) => attribute.key === dataField.key
              );
              const newSubmission = dataFieldSubmissions.find(
                (attribute) => attribute.key === dataField.key
              );
              const hasChanged =
                originalAttribute &&
                originalAttribute.selectedValues.join() !==
                  newSubmission?.selectedValues.join();
              const editable =
                (originalAttribute ? originalAttribute.editable : true) &&
                newSubmission?.editable != false;
              return (
                <FacilityDataField
                  key={index}
                  editable={editable}
                  facilityDataFieldDefinition={dataField}
                  dataFieldSubmission={dataFieldSubmissions.find(
                    (attribute) => attribute.key === dataField.key
                  )}
                  setDataFieldSubmission={(dataFieldSubmission) => {
                    const newDataFieldSubmissions = dataFieldSubmissions.filter(
                      (attribute) => {
                        return attribute.key !== dataField.key;
                      }
                    );
                    newDataFieldSubmissions.push(dataFieldSubmission);
                    setDataFieldSubmissions(newDataFieldSubmissions);
                  }}
                  hasChanged={hasChanged}
                  onChange={(dataFieldSubmission) => {}}
                  errorMessage={''}
                />
              );
            })}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 mx-large min-w-fit bg-white">
          <ManageClaimContainer
            onAccept={() =>
              onAccept(dataFieldSubmissions, selectedCategory, selectedSkills)
            }
            onReject={onReject}
            hideIcons={hideIcons}
            acceptTitle={acceptTitle}
            rejectTitle={rejectTitle}
            disableAccept={!validEntry}
          />
        </div>
      </div>
    </div>
  );
};
