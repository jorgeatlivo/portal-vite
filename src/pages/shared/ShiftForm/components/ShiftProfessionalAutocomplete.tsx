import React, { memo, useEffect, useMemo, useState } from 'react';
import { Control, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { debounce } from 'lodash-es';

import { UserFeatureEnum } from '@/services/account';
import { CheckEligibleProfessionalsRequest } from '@/services/publish-shift';

import { Typography } from '@/components/atoms/Typography';
import { SectionHeader } from '@/components/form/SectionHeader';

import { useIsFeatureEnable } from '@/hooks/use-feature-toggle';
import { ShiftInvitationConfig } from '@/types/shift-invitation';
import { frame } from '@/utils/frame';

import { ShiftFormData } from '@/pages/shared/ShiftForm/config/shift-form.config';
import { useCheckEligibleProfessionals } from '@/pages/shared/ShiftForm/hooks/useShiftMutation';
import { ProfessionalOption } from '@/pages/shared/ShiftForm/types/form';
import ProfessionalAutocomplete from './ProfessionalAutocomplete';

// Utility function to transform form values to ShiftInvitationConfig
const transformFormValuesToShiftConfig = (
  formValues: Partial<ShiftFormData>
): ShiftInvitationConfig | undefined => {
  if (
    !formValues.category?.value ||
    !formValues.startTime ||
    !formValues.endTime ||
    !formValues.dates?.length
  ) {
    return undefined;
  }

  return {
    category: formValues.category.value,
    unit: formValues.livoUnit || undefined,
    professionalField: formValues.professionalField || undefined,
    endTime: formValues.endTime,
    startTime: formValues.startTime,
    externalVisible: formValues.externalVisibility ?? true,
    internalVisible: formValues.internalVisibility ?? false,
    recurrentDates: formValues.dates,
  };
};

// Utility function to transform ShiftInvitationConfig to API request format
const transformShiftConfigToApiRequest = (
  shiftConfig: ShiftInvitationConfig,
  professionalIds: number[]
): CheckEligibleProfessionalsRequest => {
  return {
    shiftConfig: {
      category: shiftConfig.category,
      specialization: shiftConfig.specialization,
      unit: shiftConfig.unit,
      professional_field: shiftConfig.professionalField,
      endTime: shiftConfig.endTime,
      startTime: shiftConfig.startTime,
      externalVisible: shiftConfig.externalVisible,
      internalVisible: shiftConfig.internalVisible,
      recurrentDates: shiftConfig.recurrentDates,
    },
    professionalIds,
  };
};

// Props for the ShiftProfessionalAutocompleteContent component
interface ShiftProfessionalAutocompleteContentProps {
  control: Control<ShiftFormData>;
  index: number;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: ProfessionalOption,
    state: { selected: boolean }
  ) => React.ReactNode;
  renderSelected?: (
    option: ProfessionalOption,
    onClear?: () => void
  ) => React.ReactNode;
  selectedProfessionalIds: number[];
  shiftConfig?: ShiftInvitationConfig;
}

// Props for the ShiftProfessionalAutocomplete component
interface ShiftProfessionalAutocompleteProps {
  isEditMode?: boolean;
  control: Control<ShiftFormData>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: ProfessionalOption,
    state: { selected: boolean }
  ) => React.ReactNode;
  renderSelected?: (
    option: ProfessionalOption,
    onClear?: () => void
  ) => React.ReactNode;
}

const ShiftProfessionalAutocompleteContent = ({
  control,
  index,
  label = '',
  placeholder = '',
  required = false,
  disabled = false,
  renderOption,
  renderSelected: _renderSelected,
  selectedProfessionalIds,
  shiftConfig,
}: ShiftProfessionalAutocompleteContentProps) => {
  const invitedProfessionals = useWatch({
    control,
    name: 'invitedProfessionals',
  });

  const currentValue = useMemo(() => {
    const storedProfessional = invitedProfessionals?.[index];
    if (!storedProfessional) return null;

    return storedProfessional as ProfessionalOption;
  }, [index, invitedProfessionals]);

  return (
    <Controller
      name={`invitedProfessionals.${index}` as const}
      control={control}
      render={({ field, fieldState }) => {
        if (
          currentValue &&
          !isNaN(currentValue.value ?? NaN) &&
          _renderSelected
        ) {
          return (
            <div className="flex flex-col gap-1">
              {_renderSelected(currentValue, () => {
                field.onChange({
                  label: '',
                  value: NaN,
                  original: undefined,
                });
              })}
              {fieldState.error && (
                <Typography
                  variant="body/regular"
                  className="text-sm text-red-600"
                >
                  {fieldState.error.message}
                </Typography>
              )}
            </div>
          );
        }

        return (
          <div>
            <ProfessionalAutocomplete
              value={currentValue}
              onChange={(opt) => {
                field.onChange(opt);
              }}
              shiftConfig={shiftConfig}
              selectedProfessionalIds={selectedProfessionalIds}
              label={label}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              renderOption={renderOption}
            />
            {fieldState.error && (
              <Typography
                variant="body/regular"
                className="text-sm text-red-600"
              >
                {fieldState.error.message}
              </Typography>
            )}
          </div>
        );
      }}
    />
  );
};

const ShiftProfessionalAutocomplete = ({
  label = '',
  placeholder = '',
  required = false,
  disabled = false,
  renderOption,
  renderSelected,
  isEditMode = false,
  ...props
}: ShiftProfessionalAutocompleteProps) => {
  const { t } = useTranslation('edit-shift');
  const isProfessionalInviteEnabled = useIsFeatureEnable(
    UserFeatureEnum.FACILITY_PROFESSIONAL_INVITE_ENABLED
  );

  // State to track removed professionals for user feedback
  const [removedProfessionals, setRemovedProfessionals] = useState<string[]>(
    []
  );

  // Watch all relevant form fields for shift config
  const category = useWatch({
    control: props.control,
    name: 'category',
  });

  const livoUnit = useWatch({
    control: props.control,
    name: 'livoUnit',
  });

  const professionalField = useWatch({
    control: props.control,
    name: 'professionalField',
  });

  const startTime = useWatch({
    control: props.control,
    name: 'startTime',
  });

  const endTime = useWatch({
    control: props.control,
    name: 'endTime',
  });

  const externalVisibility = useWatch({
    control: props.control,
    name: 'externalVisibility',
  });

  const internalVisibility = useWatch({
    control: props.control,
    name: 'internalVisibility',
  });

  const dates = useWatch({
    control: props.control,
    name: 'dates',
  });

  const capacity = useWatch({
    control: props.control,
    name: 'capacity',
  });

  const invitedProfessionals = useWatch({
    control: props.control,
    name: 'invitedProfessionals',
  });

  const defaultInvitedProfessionals = useMemo(() => {
    const res = props.control._defaultValues.invitedProfessionals || [];

    return res
      .map((invite) => invite?.value)
      .filter((id) => typeof id === 'number' && !isNaN(id));
  }, [props.control._defaultValues.invitedProfessionals]);

  const { fields, append, remove, update } = useFieldArray<
    ShiftFormData,
    'invitedProfessionals'
  >({
    control: props.control,
    name: 'invitedProfessionals',
  });

  // Keep invited professionals compacted: when a slot is cleared, move all
  // selected items to the front and empty slots to the end. This allows
  // clearing a selection (via field.onChange or update) to automatically
  // shift remaining selections forward.
  useEffect(() => {
    const current = invitedProfessionals || [];

    // Extract non-empty selections
    const nonEmpty = current.filter(
      (p) => p && typeof p.value === 'number' && !isNaN(p.value)
    );

    // If nothing to compact or already compacted, skip
    const emptiesCount = current.length - nonEmpty.length;
    if (emptiesCount <= 0) return;

    const compacted = [
      ...nonEmpty,
      ...Array(emptiesCount).fill({
        label: '',
        value: NaN,
        original: undefined,
      }),
    ];

    const isDifferent = compacted.some((item, idx) => {
      const cur = current[idx];
      const curVal = cur?.value;
      const itemVal = item?.value;

      const curIsNumber = typeof curVal === 'number' && !isNaN(curVal);
      const itemIsNumber = typeof itemVal === 'number' && !isNaN(itemVal);

      if (curIsNumber !== itemIsNumber) return true;
      if (curIsNumber && itemIsNumber && curVal !== itemVal) return true;
      return false;
    });

    if (!isDifferent) return;

    // Use frame to avoid React batching issues (matching other usage in file)
    frame().then(() => {
      compacted.forEach((item, idx) => {
        // update each index in the field array
        update(idx, item as any);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitedProfessionals]);

  // Create shift config from watched values
  const [shiftConfig, setShiftConfig] = useState<
    ShiftInvitationConfig | undefined
  >(undefined);

  const updateShiftConfig = useMemo(
    () =>
      debounce((config: ShiftInvitationConfig | undefined) => {
        setShiftConfig(config);
      }, 300),
    []
  );

  // Update shift config when form values change
  useEffect(() => {
    if (
      !category?.value ||
      !startTime ||
      !endTime ||
      !dates?.length ||
      typeof externalVisibility !== 'boolean' ||
      typeof internalVisibility !== 'boolean'
    ) {
      updateShiftConfig(undefined);
      return;
    }

    const newConfig = transformFormValuesToShiftConfig({
      category,
      livoUnit,
      professionalField,
      startTime,
      endTime,
      externalVisibility,
      internalVisibility,
      dates,
    });

    updateShiftConfig(newConfig);
  }, [
    category,
    livoUnit,
    professionalField,
    startTime,
    endTime,
    externalVisibility,
    internalVisibility,
    dates,
    updateShiftConfig,
  ]);

  const selectedProfessionalIds = useMemo(() => {
    return (invitedProfessionals || [])
      .map((professional) => professional?.value)
      .filter((id): id is number => typeof id === 'number' && id > 0);
  }, [invitedProfessionals]);

  // When in edit mode, exclude default invited IDs from eligibility checks
  // so already-invited (default) professionals aren't re-checked/removed.
  const checkedProfessionalIds = useMemo(() => {
    if (!isEditMode) return selectedProfessionalIds;

    const whitelist = new Set(defaultInvitedProfessionals || []);
    return selectedProfessionalIds.filter((id) => !whitelist.has(id));
  }, [isEditMode, selectedProfessionalIds, defaultInvitedProfessionals]);

  // Check eligibility when shift config or selected professionals change
  const eligibilityRequest = useMemo(() => {
    if (!shiftConfig || checkedProfessionalIds.length === 0) {
      return undefined;
    }

    return transformShiftConfigToApiRequest(
      shiftConfig,
      checkedProfessionalIds
    );
  }, [shiftConfig, checkedProfessionalIds]);

  const { data: eligibilityData, isLoading: isCheckingEligibility } =
    useCheckEligibleProfessionals(eligibilityRequest, !!eligibilityRequest);

  // Handle ineligible professionals - remove them from the form
  useEffect(() => {
    if (
      eligibilityData?.inEligibleProfessionals &&
      eligibilityData.inEligibleProfessionals.length > 0
    ) {
      const ineligibleIds = eligibilityData.inEligibleProfessionals.map(
        (prof) => prof.professionalId
      );

      // Get current invited professionals
      const currentInvited = invitedProfessionals || [];

      // Check if any invited professional is ineligible
      let hasIneligibleProfessionals = false;
      const removedNames: string[] = [];

      // Check for ineligible professionals and collect their names
      currentInvited.forEach((professional, index) => {
        if (professional && ineligibleIds.includes(professional.value)) {
          hasIneligibleProfessionals = true;
          removedNames.push(professional.label);

          // Use frame to avoid React state update batching issues
          frame().then(() => {
            // Update individual field to empty slot
            update(index, {
              label: '',
              value: NaN,
              original: undefined,
            });
          });
        }
      });

      // Only show notification if we found ineligible professionals
      if (hasIneligibleProfessionals) {
        // Update state for user feedback
        setRemovedProfessionals(removedNames);

        // Clear the notification after 5 seconds
        setTimeout(() => {
          setRemovedProfessionals([]);
        }, 5000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligibilityData, invitedProfessionals]);

  useEffect(() => {
    const currentFieldsCount = fields.length;
    const targetCount = capacity || 1;

    if (currentFieldsCount < targetCount) {
      for (let i = currentFieldsCount; i < targetCount; i++) {
        frame().then(() => {
          append({
            label: '',
            value: NaN,
            original: undefined,
          });
        });
      }
    } else if (currentFieldsCount > targetCount) {
      for (let i = currentFieldsCount - 1; i >= targetCount; i--) {
        remove(i);
      }
    }
  }, [capacity, fields.length, append, remove]);

  if (!isProfessionalInviteEnabled || fields.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <SectionHeader
        title={t('assign_candidates')}
        tooltip={t('assign_candidates_tooltip')}
      />
      {isCheckingEligibility && (
        <Typography variant="body/regular" className="text-sm text-Text-Subtle">
          {t('checking_professional_eligibility')}
        </Typography>
      )}
      {removedProfessionals.length > 0 && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
          <Typography
            variant="body/regular"
            className="text-sm text-yellow-800"
          >
            {t('professionals_removed_warning', {
              professionals: removedProfessionals.join(', '),
            })}
          </Typography>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {fields.map((field, index) => (
          <ShiftProfessionalAutocompleteContent
            key={field.id}
            control={props.control}
            index={index}
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            renderOption={renderOption}
            renderSelected={renderSelected}
            selectedProfessionalIds={selectedProfessionalIds.filter(
              (_, i) => i !== index
            )}
            shiftConfig={shiftConfig}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ShiftProfessionalAutocomplete);
