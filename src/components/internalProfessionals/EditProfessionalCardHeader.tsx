import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getDenarioProfessional } from '@/services/internal';
import { RootState } from '@/store/types';

import { CategoryTag } from '@/components/common/CategoryTag';
import { Disclaimer } from '@/components/common/InfoBanner';
import LivoIcon from '@/components/common/LivoIcon';
import { ProfilePicture } from '@/components/shiftDetails/ProfilePicture';

import { Category } from '@/types/common/category';
import {
  DataFieldSubmission,
  DataFieldType,
  DenarioProfessional,
  FacilityDataFieldDefinition,
  InternalProfessional,
  internalProfessionalDisplayName,
} from '@/types/internal';
import { formatPhoneNumber } from '@/utils/utils';

import colors from '@/config/color-palette';
import { ShiftModalityEnum } from '@/types';
import { isDenarioIntegrated } from './common';
import { DenarioProfessionalModal } from './DenarioProfessionalModa';
import { EditCategoryComponent } from './EditCategoryComponent';
import { FacilityDataField } from './FacilityDataField';
import { MultiSelectDataField } from './MultiSelectDataField';

interface EditProfessionalCardHeaderProps {
  professionalProfile: InternalProfessional;
  modality: ShiftModalityEnum | null;
  selectedCategory: Category;
  availableCategories: Category[];
  setSelectedCategory: (category: Category) => void;
  setSelectedSkills: (skills: string[]) => void;
  selectedSkills: string[];
  personalDataFieldDefinitions: FacilityDataFieldDefinition[];
  dataFieldSubmissions: DataFieldSubmission[];
  setDataFieldSubmissions: (
    dataFieldSubmissions: DataFieldSubmission[]
  ) => void;
  appliedDenarioProfessionalData: Boolean;
  setAppliedDenarioProfessionalData: (
    appliedDenarioProfessionalData: Boolean
  ) => void;
}

export const EditProfessionalCardHeader: React.FC<
  EditProfessionalCardHeaderProps
> = ({
  professionalProfile,
  modality,
  selectedCategory,
  availableCategories,
  setSelectedCategory,
  setSelectedSkills,
  selectedSkills,
  personalDataFieldDefinitions,
  dataFieldSubmissions,
  setDataFieldSubmissions,
  appliedDenarioProfessionalData,
  setAppliedDenarioProfessionalData,
}) => {
  const { t } = useTranslation('professionals/profile');
  const { accountInfo } = useSelector((state: RootState) => state.account);
  const categoryAvailable =
    accountInfo?.facility.categories &&
    accountInfo?.facility.categories.length > 1;
  const categoryEditable =
    professionalProfile.categoryEditable && !appliedDenarioProfessionalData;

  const professionalPersonalDataFields = professionalProfile.dataFields
    .filter((attribute) =>
      personalDataFieldDefinitions.some(
        (dataField) => dataField.key === attribute.key
      )
    )
    .map((attribute) => ({
      key: attribute.key,
      selectedValues: attribute.values?.length
        ? attribute.values.map((value) => value.value)
        : [attribute.value],
      editable: attribute.editable,
    }));

  function getSkillsByCategory(category: Category) {
    if (category && category.code) {
      return accountInfo?.facility.skillsByCategory[category.code];
    }
    return [];
  }

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState('');
  const [isLoadingNationalId, setIsLoadingNationalId] = useState(false);
  const [showDenarioModal, setShowDenarioModal] = useState(false);
  const [denarioProfessional, setDenarioProfessional] =
    useState<DenarioProfessional | null>(null);

  function handleNationalIdChanged(nationalId: string) {
    if (
      accountInfo?.facility.livoInternalOnboardingStrategy ===
      'DENARIO_INTEGRATED'
    ) {
      setIsLoadingNationalId(true);
      setNationalIdErrorMessage('');
      getDenarioProfessional(nationalId)
        .then((denarioProfessional) => {
          if (typeof denarioProfessional === 'string') {
            setNationalIdErrorMessage(denarioProfessional);
          } else {
            setShowDenarioModal(true);
            setDenarioProfessional(denarioProfessional);
          }
        })
        .finally(() => {
          setIsLoadingNationalId(false);
        });
    }
  }

  function handleAcceptProfessionalData() {
    setShowDenarioModal(false);
    setAppliedDenarioProfessionalData(true);

    // set EMPLOYEE_NUMBER + UNIT + unchangable
    var newSubmissions = updateDataFieldSubmissions(
      dataFieldSubmissions,
      'EMPLOYEE_NUMBER',
      denarioProfessional!.employeeNumber
    );
    newSubmissions = updateDataFieldSubmissions(
      newSubmissions,
      'UNIT',
      denarioProfessional!.unit
    );

    setDataFieldSubmissions(newSubmissions);
    // set category + unchangable

    // set DNI + unchangable
  }

  function updateDataFieldSubmissions(
    submissions: DataFieldSubmission[],
    key: string,
    value: string
  ) {
    const newDataFieldSubmissions = submissions.filter((attribute) => {
      return attribute.key !== key;
    });
    const newDataFieldSubmission = {
      key: key,
      selectedValues: [value],
      editable: false,
    };
    newDataFieldSubmissions.push(newDataFieldSubmission);
    return newDataFieldSubmissions;
  }

  function updateSelectedCategory(categoryCode: string) {
    setSelectedCategory(
      availableCategories.find((category) => category.code === categoryCode)!
    );
    if (categoryCode !== selectedCategory?.code) {
      setSelectedSkills([]);
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-small pb-large">
      <ProfilePicture
        profilePictureUrl={professionalProfile?.profilePictureUrl}
        modality={modality}
        size={64}
      />
      <div className="flex w-full flex-col items-center ">
        <p className="heading-md px-small text-Text-Default">
          {internalProfessionalDisplayName(professionalProfile)}
        </p>

        {professionalProfile.disclaimer != null && (
          <Disclaimer
            message={professionalProfile.disclaimer.message}
            severity={professionalProfile.disclaimer.severity}
          />
        )}

        {isDenarioIntegrated(accountInfo) && (
          <div className="flex w-full flex-col space-y-large py-medium">
            <div className="flex flex-row space-x-small">
              <LivoIcon
                size={24}
                name="stethoscope"
                color={colors['Grey-400']}
              />
              <p className="body-regular">{t('personal_data_label')}</p>
            </div>
            <div className="flex items-center space-x-small">
              <div className="flex flex-col">
                <div className="pb-1 font-['Roboto'] text-base font-normal leading-normal text-Divider-Strong">
                  {t('phone_label')}
                </div>
                <div className="font-['Roboto'] text-base font-bold leading-normal text-Grey-950">
                  <div className="flex flex-row items-center space-x-small">
                    {professionalProfile.phoneNumberDisclaimer && (
                      <div className="group relative">
                        <div className="pr-1">
                          <LivoIcon
                            name="alert-triangle"
                            size={16}
                            color="#FF0000"
                          />
                        </div>
                        <div className="absolute left-0 top-8 z-10 hidden w-48 justify-center whitespace-nowrap rounded bg-Grey-950 p-2 shadow-lg group-hover:block">
                          <p className="shrink grow basis-0 font-['Roboto'] text-xs font-normal leading-none tracking-tight text-white">
                            {professionalProfile.phoneNumberDisclaimer}
                          </p>
                        </div>
                      </div>
                    )}
                    {formatPhoneNumber(professionalProfile.phoneNumber)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-small">
              <div className="flex flex-col">
                <div className="pb-1 font-['Roboto'] text-base font-normal leading-normal text-Divider-Strong">
                  {t('email_label')}
                </div>
                <div className="font-['Roboto'] text-base font-bold leading-normal text-Grey-950">
                  {professionalProfile.email || t('missing_email_label')}
                </div>
              </div>
            </div>

            {personalDataFieldDefinitions.map((dataField, index) => {
              const originalAttribute = professionalPersonalDataFields.find(
                (attribute) => attribute.key === dataField.key
              );
              const hasChanged =
                originalAttribute &&
                originalAttribute.selectedValues.join() !==
                  dataFieldSubmissions
                    .find((attribute) => attribute.key === dataField.key)
                    ?.selectedValues.join();
              const nationalIdFromDenario =
                dataField.key === 'NATIONAL_ID' &&
                appliedDenarioProfessionalData;
              const editable =
                (originalAttribute ? originalAttribute.editable : true) &&
                !nationalIdFromDenario;
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
                  onChange={(dataFieldSubmission) => {
                    handleNationalIdChanged(
                      dataFieldSubmission.selectedValues[0]
                    );
                  }}
                  isLoading={isLoadingNationalId}
                  errorMessage={nationalIdErrorMessage}
                />
              );
            })}
          </div>
        )}
        {showDenarioModal && denarioProfessional && (
          <DenarioProfessionalModal
            denarioProfessional={denarioProfessional}
            onClose={() => setShowDenarioModal(false)}
            onAcceptProfessionalData={handleAcceptProfessionalData}
          />
        )}

        {categoryAvailable || professionalProfile.skills ? (
          <div className="flex w-full flex-col space-y-large py-medium">
            <div className="flex flex-row space-x-small">
              <LivoIcon
                name="stethoscope"
                size={24}
                color={colors['Grey-400']}
              />
              <p className="body-regular">
                {professionalProfile.category
                  ? t('category_section_label')
                  : t('skills_section_label')}
              </p>
            </div>
            {categoryAvailable ? (
              !categoryEditable ? (
                <div className="flex items-center space-x-small">
                  <CategoryTag text={professionalProfile.category.acronym} />
                  <p className="body-regular text-Text-Subtle">
                    {professionalProfile.category.displayText}
                  </p>
                </div>
              ) : (
                <EditCategoryComponent
                  hasChanged={
                    selectedCategory?.code !==
                    professionalProfile.category?.code
                  }
                  selectedCategory={selectedCategory}
                  availableCategories={availableCategories}
                  setSelectedCategory={(category) => {
                    updateSelectedCategory(category.code);
                  }}
                />
              )
            ) : null}

            {(getSkillsByCategory(selectedCategory) || []).length > 0 ? (
              <MultiSelectDataField
                hasChanged={
                  selectedSkills !==
                  professionalProfile.skills?.professionalSkills
                }
                title={t('skills_label')}
                dataFieldDefinition={{
                  key: 'skills',
                  label: t('skills_label'),
                  type: DataFieldType.MULTI_SELECT,
                  options: getSkillsByCategory(selectedCategory) || [],
                  editable: true,
                }}
                selectedValues={selectedSkills}
                setSelectedValues={(selectedValues) => {
                  setSelectedSkills(selectedValues);
                }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
