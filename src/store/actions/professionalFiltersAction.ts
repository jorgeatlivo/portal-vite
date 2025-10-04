import { Filter, FilterOption } from '@/types/common/shiftFilters';

export function addProfessionalFilter(filter: Filter) {
  return {
    type: 'ADD_PROFESSIONAL_FILTER',
    payload: filter,
  };
}

export function removeProfessionalFilter(filter: Filter) {
  return {
    type: 'REMOVE_PROFESSIONAL_FILTER',
    payload: filter,
  };
}

export function setProfessionalFilters(filters: Filter[]) {
  return {
    type: 'SET_PROFESSIONAL_FILTERS',
    payload: filters,
  };
}

export function clearProfessionalFilters() {
  return {
    type: 'CLEAR_PROFESSIONAL_FILTERS',
  };
}

export function selectOptionInProfessionalFilter(
  filter: Filter,
  option: FilterOption
) {
  return {
    type: 'SELECT_OPTION_IN_PROFESSIONAL_FILTER',
    payload: {
      filter,
      option,
    },
  };
}

export function unselectOptionInProfessionalFilter(
  filter: Filter,
  option: FilterOption
) {
  return {
    type: 'UNSELECT_OPTION_IN_PROFESSIONAL_FILTER',
    payload: {
      filter,
      option,
    },
  };
}

export function clearSelectedProfessionalSpecificFilter(filter: Filter) {
  return {
    type: 'CLEAR_PROFESSIONAL_FILTER_SELECTED_OPTIONS_FOR_FILTER',
    payload: {
      filter,
    },
  };
}

export function resetSelectedOptionsInProfessionalFilter() {
  return {
    type: 'RESET_SELECTED_PROFESSIONAL_FILTERS_OPTIONS',
  };
}

export function clearSelectedOptionsInProfessionalFilter() {
  return {
    type: 'CLEAR_SELECTED_PROFESSIONAL_FILTERS_OPTIONS',
  };
}

export function applySelectedOptionsInProfessionalFilter() {
  return {
    type: 'APPLY_SELECTED_PROFESSIONAL_FILTERS_OPTIONS',
  };
}

export function clearAppliedOptionsInProfessionalFilter() {
  return {
    type: 'CLEAR_APPLIED_PROFESSIONAL_FILTERS_OPTIONS',
  };
}
