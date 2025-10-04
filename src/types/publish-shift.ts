import { translate } from '@/services/i18next/translate';

import { Category } from './common/category';
import { ValueDisplayPair } from './offers';
import { SpecializationDTO } from './shifts';

interface TimeDTO {
  hour: number;
  minute: number;
  second?: number;
  nano?: number;
}

export interface ScheduleDTO {
  startTime: TimeDTO;
  endTime: TimeDTO;
}

export interface ShiftTimeConfigDTO {
  dayShift: ScheduleDTO;
  eveningShift: ScheduleDTO;
  nightShift: ScheduleDTO;
}

export interface CalendarSummary {
  date: string;
  holiday: boolean;
}

export type CompensationOptionsConfigType = {
  configurable: boolean;
  options: [
    {
      value: string;
      displayText: string;
      enabledByDefault: boolean;
    },
  ];
};

export interface PublishShiftConfigurationDTO {
  specializations: SpecializationDTO[];
  shiftTimeConfig: ShiftTimeConfigDTO;
  livoPoolOnboarded: boolean;
  livoInternalOnboarded: boolean;
  units: string[];
  professionalFields?: ValueDisplayPair[];
  calendarSummary?: CalendarSummary[];
  unitVisibleConfigurable: boolean;
  compensationOptions?: CompensationOptionsConfigType;
  unitConfigurable: boolean;
  categories: Category[];
  onboardingShifts: {
    featureEnabled: boolean;
    defaultValue: boolean;
    pricing: string;
    hours: number;
  };
}

export enum RecurrencyOptionsEnum {
  ALL_SHIFTS = 'ALL_SHIFTS',
  THIS_SHIFT = 'THIS_SHIFT',
}

export const buildRecurrencyOptions = () => {
  return [
    {
      label: translate('edit-shift:recurrency_option_this_shift'),
      name: RecurrencyOptionsEnum.THIS_SHIFT,
    },
    {
      label: translate('edit-shift:recurrency_option_all_shifts'),
      name: RecurrencyOptionsEnum.ALL_SHIFTS,
      disclaimer: translate(
        'edit-shift:recurrency_options_all_shifts_disclaimer'
      ),
    },
  ];
};
