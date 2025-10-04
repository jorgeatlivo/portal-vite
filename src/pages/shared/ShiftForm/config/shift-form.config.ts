import { ZodIssueCode, z } from 'zod';

import { ShiftPublicationRequest } from '@/services/publish-shift';
import { ShiftUpdateRequest } from '@/services/shifts-calendar';

import { FormSelectOption } from '@/components/form/FormSelect';

import { ClaimRequest, ClaimStatus } from '@/types/claims';
import { ValueDisplayPair } from '@/types/offers';
import {
  PublishShiftConfigurationDTO,
  ShiftTimeConfigDTO,
} from '@/types/publish-shift';
import { ShiftInvitationProfessional } from '@/types/shift-invitation';
import { Shift, ShiftTimeInDayEnum } from '@/types/shifts';
import { day, setTime, today } from '@/utils/datetime';

import { ProfessionalOption } from '@/pages/shared/ShiftForm/types/form';
import { calculateTotalPay } from '@/pages/shared/ShiftForm/utils/totalPayUtils';
import { ShiftModalityEnum } from '@/types';
import { SHIFT_TIME_IN_DAY_DEFINITIONS } from '@/utils';

export const buildShiftFormSchema = ({
  unitConfigurable,
}: {
  unitConfigurable: boolean;
}) =>
  z
    .object({
      category: z
        .object({
          label: z.string(),
          value: z.string().min(1, 'offers:category_required'),
        })
        .nullable()
        .refine((check) => check !== null, 'offers:category_required'),
      livoUnit: z.string(),
      dates: z.array(z.string()),
      professionalField: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      externalVisibility: z.boolean().default(true),
      internalVisibility: z.boolean().default(false),
      onboardingShiftsRequired: z.boolean().default(false),
      price: z.string().optional(),
      priceMode: z.enum(['hourly', 'total']).default('hourly').optional(),
      compensationOptions: z.array(z.string()),
      capacity: z.number().min(1).max(5),
      totalPay: z.number().optional(),
      details: z.string().optional(),
      unitVisible: z.boolean().optional(),
      temporalId: z.string().optional(),
      invitedProfessionals: z
        .array(
          z.union([
            z.object({
              // accept NaN values too, they will be filtered out later
              value: z.number().or(z.nan()),
              label: z.string(),
              editable: z.boolean().optional(),
              original: z.any(),
            }),
            z.null(),
          ])
        )
        .optional(),
    })
    .refine(
      (data) =>
        !data.internalVisibility ||
        (data.livoUnit && data.internalVisibility && unitConfigurable),
      {
        message: 'publish-shift:enter_valid_unit',
        path: ['livoUnit'],
      }
    )
    .refine((data) => data.externalVisibility || data.internalVisibility, {
      message: 'publish-shift:select_at_least_one_audience',
      path: ['externalVisibility'],
    })
    .superRefine((data, ctrl) => {
      if (!data.externalVisibility) return;
      const numericPrice = data.price ? +data.price.replace(',', '.') : 0;

      if (numericPrice === 0) {
        return ctrl.addIssue({
          message: 'publish-shift:enter_valid_salary',
          path: ['price'],
          code: ZodIssueCode.custom,
        });
      }

      data.totalPay = calculateTotalPay(
        data.price,
        data.startTime,
        data.endTime,
        data.priceMode
      );
    });

export type ShiftFormData = z.infer<ReturnType<typeof buildShiftFormSchema>>;

function stringToSelectOption(
  inputs: string[] | undefined
): FormSelectOption[] {
  return inputs?.map((input) => ({ value: input, label: input })) ?? [];
}

function valueDisplayPairToSelectOption(
  inputs?: ValueDisplayPair[]
): FormSelectOption[] {
  return (
    inputs?.map(({ value, displayText }) => ({
      value,
      label: displayText,
    })) ?? []
  );
}

export function buildFormOptions(config?: PublishShiftConfigurationDTO) {
  return {
    units: stringToSelectOption(config?.units),
    professionalFields: valueDisplayPairToSelectOption(
      config?.professionalFields
    ),
    calendarSummary: config?.calendarSummary,
    shiftTimeOptions: config?.shiftTimeConfig,
    onboardingShift: config?.onboardingShifts,
    compensationOptions: config?.compensationOptions,
    unitConfigurable: config?.unitConfigurable,
    livoPoolOnboarded: config?.livoPoolOnboarded,
    livoInternalOnboarded: config?.livoInternalOnboarded,
  };
}

export const getTimeForConfig = (
  config: ShiftTimeConfigDTO,
  shiftTime: ShiftTimeInDayEnum,
  selectedDate: string
) => {
  const shiftTimeInDayHashKey =
    SHIFT_TIME_IN_DAY_DEFINITIONS[shiftTime]?.hashKey;

  const shiftTimeInDayConfig =
    config[shiftTimeInDayHashKey as keyof typeof config];

  if (!shiftTimeInDayConfig) {
    return [day(selectedDate).toISOString(), day(selectedDate).toISOString()];
  }

  const startTotalMinutes =
    shiftTimeInDayConfig.startTime.hour * 60 +
    shiftTimeInDayConfig.startTime.minute;
  const endTotalMinutes =
    shiftTimeInDayConfig.endTime.hour * 60 +
    shiftTimeInDayConfig.endTime.minute;
  const isOverDayShift = endTotalMinutes <= startTotalMinutes;

  const startTime = setTime(day(selectedDate), {
    hour: shiftTimeInDayConfig.startTime.hour,
    minute: shiftTimeInDayConfig.startTime.minute,
  }).toISOString();

  const endTime = setTime(
    isOverDayShift ? day(selectedDate).add(1, 'day') : day(selectedDate),
    {
      hour: shiftTimeInDayConfig.endTime.hour,
      minute: shiftTimeInDayConfig.endTime.minute,
    }
  ).toISOString();

  return [startTime, endTime];
};

export const staticDefault: ShiftFormData = {
  category: null,
  livoUnit: '',
  dates: [],
  professionalField: '',
  startTime: '',
  endTime: '',
  externalVisibility: true,
  internalVisibility: false,
  onboardingShiftsRequired: false,
  price: undefined,
  priceMode: 'total',
  compensationOptions: [],
  capacity: 1,
  totalPay: 0,
  details: undefined,
  unitVisible: undefined,
  invitedProfessionals: [],
};

const invitedStatusMap = new Map([
  [ClaimStatus.PENDING_PRO_ACCEPT, true],
  [ClaimStatus.REJECTED_BY_PRO, true],
  [ClaimStatus.INVITATION_EXPIRED, true],
  [ClaimStatus.PRO_NOT_AVAILABLE, true],
]);

const acceptedStatusMap = new Map([
  //
  [ClaimStatus.APPROVED, true],
]);

function mapClaimsToInvitations(
  claims: ClaimRequest[] = []
): ProfessionalOption[] {
  return claims
    ?.filter(
      (claim) =>
        invitedStatusMap.has(claim.status) ||
        acceptedStatusMap.has(claim.status)
    )
    .map((claim) => {
      const accepted = acceptedStatusMap.has(claim.status);
      const origin: ShiftInvitationProfessional = {
        avatarUrl: claim.professionalProfile.profilePictureUrl,
        completedShiftsInFacility:
          claim?.professionalProfile?.totalShiftsInFacility
            ?.totalShiftsInFacility ?? 0,
        favorite: claim.professionalProfile.favorite ?? false,
        id: claim.professionalProfile.id,
        name:
          claim.professionalProfile.firstName +
          ' ' +
          claim.professionalProfile.lastName,
        role:
          claim.professionalProfile.modality === ShiftModalityEnum.EXTERNAL
            ? 'PROFESSIONAL'
            : 'INTERNAL_PROFESSIONAL',
        note: null,
      };
      const proId = origin.id;
      const label = origin.name;
      return {
        value: proId,
        label,
        locked: accepted,
        lockedReason: accepted
          ? 'edit-shift:professional_already_accepted_shift'
          : undefined,
        original: origin,
      } satisfies ProfessionalOption;
    });
}

export const rehydrateInitFormData = ({
  initialShift: shift,
  configs,
}: {
  isEdit: boolean;
  initialShift: Shift;
  configs: PublishShiftConfigurationDTO;
}): ShiftFormData => {
  const _selectedDay = day(shift.startTime).format('YYYY-MM-DD');

  let startTime = day(shift?.startTime).toISOString();
  let endTime = day(shift?.finishTime).toISOString();

  if (!startTime || !endTime) {
    const timeSchedule = getTimeForConfig(
      configs?.shiftTimeConfig,
      shift.shiftTimeInDay,
      _selectedDay
    );
    startTime = timeSchedule[0];
    endTime = timeSchedule[1];
  }

  return {
    category: shift.category
      ? { label: shift.category.displayText, value: shift.category.code }
      : null,
    livoUnit: shift.unit || '',
    dates: [shift.recurrentDates?.[0] || _selectedDay],
    professionalField: shift.professionalField?.value || '',
    startTime,
    endTime,
    externalVisibility: shift.externalVisible,
    internalVisibility: shift.internalVisible,
    onboardingShiftsRequired: shift.onboardingShiftsRequired || false,
    price: shift.totalPay ? shift.totalPay.toString() : undefined,
    priceMode: 'total',
    compensationOptions:
      shift.compensationOptions?.map((option) => option.value) || [],
    capacity: shift.capacity || 1,
    totalPay: 0,
    details: shift.details || undefined,
    unitVisible:
      typeof shift.unitVisible === 'boolean' ? shift.unitVisible : true,
    invitedProfessionals: mapClaimsToInvitations(shift.claims) || [],
  };
};

export const buildInitialFormData = ({
  configs,
  selectedDay,
  selectedCategoryCode,
  shiftTimeInDay = ShiftTimeInDayEnum.MORNING,
}: {
  configs: PublishShiftConfigurationDTO;
  selectedDay?: string;
  selectedCategoryCode: string | undefined;
  shiftTimeInDay: ShiftTimeInDayEnum | undefined;
}): ShiftFormData => {
  const _selectedDay = selectedDay || today().format('YYYY-MM-DD');

  const [initialStartTime, initialEndTime] = getTimeForConfig(
    configs?.shiftTimeConfig,
    shiftTimeInDay,
    _selectedDay
  );

  const categoryConfig = configs?.categories.find(
    (category) => category.code === selectedCategoryCode
  );

  return {
    category: selectedCategoryCode
      ? {
          label: categoryConfig?.displayText || selectedCategoryCode,
          value: selectedCategoryCode,
        }
      : null,
    livoUnit: '',
    dates: [day(_selectedDay).format('YYYY-MM-DD')],
    professionalField: '',
    startTime: initialStartTime,
    endTime: initialEndTime,
    externalVisibility:
      !!configs?.livoPoolOnboarded && !!categoryConfig?.visibleForLivoPool,
    internalVisibility:
      !configs?.livoPoolOnboarded ||
      (configs.livoInternalOnboarded &&
        !!categoryConfig?.visibleForLivoInternal),
    onboardingShiftsRequired: configs?.onboardingShifts?.defaultValue || false,
    price: undefined,
    priceMode: 'total',
    compensationOptions:
      configs?.compensationOptions?.options
        .filter((option) => option.enabledByDefault)
        .map((option) => option.value) || [],
    capacity: 1,
    totalPay: 0,
    details: undefined,
    unitVisible: true,
    invitedProfessionals: [],
  };
};

export function transformShiftFormDataToRequestPayload(
  formData: ShiftFormData
): ShiftPublicationRequest {
  return {
    startTime: new Date(formData.startTime),
    endTime: new Date(formData.endTime),
    specialization: '',
    professionalField: formData.professionalField,
    totalPay: formData.totalPay,
    capacity: formData.capacity,
    details: formData.details || '',
    unit: formData.livoUnit,
    externalVisible: formData.externalVisibility,
    internalVisible: formData.internalVisibility,
    recurrentDates: formData.dates,
    category: formData.category?.value,
    unitVisible: formData.unitVisible || false,
    compensationOptions: formData.compensationOptions,
    onboardingShiftsRequired: formData.onboardingShiftsRequired,
    temporalId: formData.temporalId,
    invitedProfessionalIds: formData.invitedProfessionals
      ?.map((pro) => pro?.value ?? NaN)
      .filter((value) => Number.isInteger(value)),
  };
}

export function transformShiftFormToModificationRequestPayload(
  formData: ShiftFormData
): ShiftUpdateRequest {
  const fullPayload: ShiftUpdateRequest = {
    totalPay: formData.totalPay!,
    startTime: new Date(formData.startTime),
    endTime: new Date(formData.endTime),
    capacity: formData.capacity,
    details: formData.details || '',
    unit: formData.livoUnit,
    externalVisible: formData.externalVisibility,
    internalVisible: formData.internalVisibility,
    unitVisible: formData.unitVisible || false,
    invitedProfessionalIds: formData.invitedProfessionals
      ?.map((pro) => pro?.value ?? NaN)
      .filter((value) => Number.isInteger(value)),
  };

  return fullPayload;
}

export type ShiftFormOptions = ReturnType<typeof buildFormOptions>;
