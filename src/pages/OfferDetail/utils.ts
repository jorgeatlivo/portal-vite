import { numericFormatter } from 'react-number-format';

import { translate } from '@/services/i18next/translate';
import { FormConfig } from '@/queries/offer-mutation';

import {
  ContractDurationType,
  ContractType,
  OfferDetail,
  OfferRequirements,
  SalaryPeriodType,
  ScheduleType,
  StartDateType,
} from '@/types/offers';
import { formatDate } from '@/utils/datetime';
import { uuidv4 } from '@/utils/utils';

import { OfferFormData } from '@/pages/OfferDetail/offer-form.config';

export function mapDurationToText(
  duration: ContractDurationType | null | undefined,
  date?: string
) {
  if (!duration) {
    return '';
  }

  switch (duration) {
    case 'ONE_MONTH':
      return translate('calendar:n_months', { count: 1 });
    case 'TWO_MONTH':
      return translate('calendar:n_months', { count: 2 });
    case 'THREE_MONTH':
      return translate('calendar:n_months', { count: 3 });
    case 'LESS_THAN_SIX_MONTH':
      return translate('calendar:less_than_n_months', { count: 6 });
    case 'LESS_THAN_ONE_YEAR':
      return translate('calendar:less_than_n_years', { count: 1 });
    case 'SPECIFIC_DATE':
      return date ? formatDate(date) : '';
    default:
      return '';
  }
}

export function mapStartDateToText(
  type: StartDateType | undefined,
  date?: string
) {
  if (type === 'ASAP') {
    return translate('calendar:asap');
  }

  return date ? formatDate(date) : '';
}

export function mapContractType(contractType: ContractType) {
  switch (contractType) {
    case ContractType.PERMANENT:
      return translate('offers:contract_type_permanent');
    case ContractType.TEMPORAL:
      return translate('offers:contract_type_temporal');
    case ContractType.MATERNITY:
      return translate('offers:contract_type_maternity');
    case ContractType.PATERNITY:
      return translate('offers:contract_type_paternity');
    case ContractType.LEAVE:
      return translate('offers:contract_type_leave');
    default:
      return contractType;
  }
}

export function joinSchedule(schedule: ScheduleType[]) {
  // case less than 3 items

  if (schedule.length <= 3) {
    return schedule.map(mapScheduleToText).join(', ');
  }

  // case more than 3 items
  const lastIndex = schedule.length - 1;
  return `${schedule.slice(0, lastIndex).map(mapScheduleToText).join(', ')} y ${mapScheduleToText(schedule[lastIndex])}`;
}

function mapScheduleToText(schedule: ScheduleType) {
  switch (schedule) {
    case ScheduleType.MORNING:
      return translate('offers:schedule_morning');
    case ScheduleType.EVENING:
      return translate('offers:schedule_evening');
    case ScheduleType.NIGHT:
      return translate('offers:schedule_night');
    case ScheduleType.ROTATING:
      return translate('offers:contract_type_rotating');
    case ScheduleType.WEEKENDS:
      return translate('offers:contract_type_weekends');
    case ScheduleType.HOLIDAYS:
      return translate('offers:schedule_holidays');
    case ScheduleType.COVERS:
      return translate('offers:schedule_covers');
    case ScheduleType.FLEXIBLE:
      return translate('offers:schedule_flexible');
    default:
      return '-';
  }
}
function mapPeriodToText(period: SalaryPeriodType) {
  switch (period) {
    case 'YEAR':
      return translate('offers:salary_period_year');
    case 'MONTH':
      return translate('offers:salary_period_month');
    case 'HOUR':
      return translate('offers:salary_period_hour');
    case 'TOTAL':
      return translate('offers:salary_period_total');
    default:
      return '';
  }
}

export function mapSalary(
  minSalary: string = '',
  maxSalary: string = '',
  period: SalaryPeriodType
) {
  const min = numericFormatter(minSalary ?? '', {
    decimalScale: 2,
    decimalSeparator: ',',
    thousandSeparator: '.',
  });
  const max = numericFormatter(maxSalary ?? '', {
    decimalScale: 2,
    decimalSeparator: ',',
    thousandSeparator: '.',
  });

  const periodText = mapPeriodToText(period);
  const isSingleSalary = !min || !max || min === max;

  const rangeSalary = isSingleSalary ? `${max || min}€` : `${min}€ - ${max}€`;

  return `${rangeSalary} /${periodText}`;
}

export const NOT_EDITABLE_STATUSES = ['CLOSED', 'CANCELED', 'CLOSED_EXPIRED'];

export const NOT_DELETABLE_STATUSES = ['CLOSED', 'CANCELED', 'CLOSED_EXPIRED'];

function mapCategoryToOption(
  category: string,
  categories?: FormConfig['categories']
) {
  const match = categories?.find((c) => c.value === category);

  if (!match) {
    return { label: '', value: '' };
  }

  return {
    label: match?.label,
    value: match?.value,
  };
}

function mapRequirements(requirements: OfferRequirements[]) {
  return requirements.map((req) => ({
    livoUnit: req.livoUnit?.value,
    experience: req.experience.value,
    professionalField: req.professionalField?.value,
  }));
}

/**
 * build form data from offer detail
 * to display in form
 */
export function buildDetailToFormValue(
  offer?: OfferDetail,
  config?: FormConfig,
  isEditing?: boolean
): OfferFormData {
  const defaultData: OfferFormData = {
    category: mapCategoryToOption(offer?.category ?? '', config?.categories),
    professionalField: offer?.professionalField?.value ?? '',
    livoUnit: offer?.livoUnit?.value ?? '',
    contractType: offer?.contractType ?? '',
    startDateType: offer?.startDate?.type ?? 'ASAP',
    startDate: offer?.startDate?.date ?? '',
    durationType: offer?.duration?.type ?? '',
    duration: offer?.duration?.date ?? '',
    schedule: offer?.schedules ?? [],
    scheduleDetails: offer?.scheduleDetails ?? '',
    salaryMin: offer?.salaryMin ?? '',
    salaryMax: offer?.salaryMax ?? '',
    salaryDetails: offer?.salaryDetails ?? '',
    no_experience: isEditing ? (offer?.requirements ?? []).length === 0 : false,
    requirements: mapRequirements(offer?.requirements ?? []),
    perks: [
      ...(offer?.perks?.map((perk) => perk.perk ?? '') ?? []),
      `other:${uuidv4()}:false:`,
    ],
    salaryPeriod: offer?.salaryPeriod ?? SalaryPeriodType.YEAR,
    additionalRequirements: offer?.additionalRequirements ?? '',
    details: offer?.details ?? '',
  };

  return defaultData;
}
