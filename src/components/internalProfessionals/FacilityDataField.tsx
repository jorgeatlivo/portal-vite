import { CustomInput } from '../../components/common/CustomInput';
import {
  DataFieldSubmission,
  DataFieldType,
  FacilityDataFieldDefinition,
} from '../../types/internal';
import { MultiSelectDataField } from './MultiSelectDataField';
import { SingleSelectDataField } from './SingleSelectDataField';

interface FacilityDataFieldProps {
  facilityDataFieldDefinition: FacilityDataFieldDefinition;
  setDataFieldSubmission: (dataFieldSubmission: DataFieldSubmission) => void;
  dataFieldSubmission?: DataFieldSubmission;
  hasChanged?: boolean;
  editable?: boolean;
  onChange?: (dataFieldSubmission: DataFieldSubmission) => void; // onChange only supported FreeText input (CustomInput component) for NATIONAL_ID field
  errorMessage?: string;
  isLoading?: boolean;
}

export const FacilityDataField: React.FC<FacilityDataFieldProps> = ({
  facilityDataFieldDefinition,
  dataFieldSubmission,
  setDataFieldSubmission,
  hasChanged,
  editable,
  onChange,
  errorMessage,
  isLoading,
}) => {
  const selectedValues = dataFieldSubmission?.selectedValues || [];

  return (
    <div>
      {editable ? (
        <>
          {facilityDataFieldDefinition.type === DataFieldType.SINGLE_SELECT && (
            <SingleSelectDataField
              hasChanged={hasChanged}
              dataFieldDefinition={facilityDataFieldDefinition}
              selectedValue={selectedValues.length > 0 ? selectedValues[0] : ''}
              title={facilityDataFieldDefinition.label}
              setSelectedValue={(selectedValue) => {
                setDataFieldSubmission({
                  key: facilityDataFieldDefinition.key,
                  selectedValues: [selectedValue],
                  editable: true,
                });
              }}
            />
          )}
          {facilityDataFieldDefinition.type === DataFieldType.MULTI_SELECT && (
            <MultiSelectDataField
              hasChanged={hasChanged}
              title={facilityDataFieldDefinition.label}
              dataFieldDefinition={facilityDataFieldDefinition}
              selectedValues={selectedValues}
              setSelectedValues={(selectedValues) => {
                setDataFieldSubmission({
                  key: facilityDataFieldDefinition.key,
                  selectedValues: selectedValues,
                  editable: true,
                });
              }}
            />
          )}
          {facilityDataFieldDefinition.type === DataFieldType.FREE_TEXT && (
            <CustomInput
              hasChanged={hasChanged}
              errorMessage={errorMessage}
              isLoading={isLoading}
              setValue={(text) => {
                setDataFieldSubmission({
                  key: facilityDataFieldDefinition.key,
                  selectedValues: [text],
                  editable: true,
                });
              }}
              onValueBlur={(text) => {
                onChange?.({
                  key: facilityDataFieldDefinition.key,
                  selectedValues: [text],
                  editable: true,
                });
              }}
              selectedValue={selectedValues.length > 0 ? selectedValues[0] : ''}
              placeHolder={facilityDataFieldDefinition.label}
              label={facilityDataFieldDefinition.label}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col px-3">
          <div className="pb-1 font-['Roboto'] text-base font-normal leading-normal text-Divider-Strong">
            {facilityDataFieldDefinition.label}
          </div>
          <div className="font-['Roboto'] text-base leading-normal text-Grey-950">
            {selectedValues.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};
