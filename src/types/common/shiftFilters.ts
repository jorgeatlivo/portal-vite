import { InternalProfessional } from '@/types/internal';
import { Shift, Unit } from '@/types/shifts';

import { Category } from './category';

export const accesors: {
  [key: string]: (value: any) => {
    displayName: string;
    value: string;
  };
} = {
  unit: (shift: Shift) => ({
    displayName: shift.unit ? shift.unit : '',
    value: shift.unit ? shift.unit : '',
  }),
  category: (shift: Shift) => ({
    displayName: shift.category ? shift.category.displayText : '',
    value: shift.category ? shift.category.code : '',
  }),
};

const optionToDisplayTextMap: {
  [key: string]: (option: any) => string;
} = {
  unit: (unit: Unit) => unit.displayName,
  category: (category: Category) => category.displayText,
};

const optionToValueMap: {
  [key: string]: (option: any) => string;
} = {
  unit: (unit: Unit) => unit.value,
  category: (category: Category) => category.code,
};

export type FilterOption = Category | Unit;

export interface Filter {
  key: string;
  name: string;
  options: FilterOption[];
  selectedOptions: FilterOption[];
  appliedOptions: FilterOption[];
}

export function evaluateProfessionalFilter(
  filter: Filter,
  professional: InternalProfessional
): boolean {
  const appliedOptionsMapped = filter.appliedOptions.map(
    optionToValueMap[filter.key]
  );
  if (filter.key === 'unit') {
    return appliedOptionsMapped.includes(professional.unit);
  }

  if (filter.key === 'category') {
    return appliedOptionsMapped.includes(professional.category.code);
  }

  return true;
}

export function applyProfessionalFilter(
  filter: Filter,
  professionals: InternalProfessional[]
): InternalProfessional[] {
  return filter.appliedOptions.length > 0
    ? professionals.filter((professional) =>
        evaluateProfessionalFilter(filter, professional)
      )
    : professionals;
}

export function evaluateItem(filter: Filter, item: Shift): boolean {
  const appliedOptionsMapped = filter.appliedOptions.map(
    optionToValueMap[filter.key]
  );
  const itemValue = accesors[filter.key](item).value;
  return itemValue == '' || appliedOptionsMapped.includes(itemValue);
}

export function applyFilter(filter: Filter, items: Shift[]): Shift[] {
  return filter.appliedOptions.length > 0
    ? items.filter((item) => evaluateItem(filter, item))
    : items;
}

export function getOptionToDisplayText(
  filter: Filter
): (option: any) => string {
  return optionToDisplayTextMap[filter.key];
}

export function getOptionToValue(filter: Filter): (option: any) => string {
  return optionToValueMap[filter.key];
}
