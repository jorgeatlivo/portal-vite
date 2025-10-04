import { Filter, FilterOption } from '@/types/common/shiftFilters';

export function addFilter(filter: Filter) {
  return {
    type: 'ADD_FILTER',
    payload: filter,
  };
}

export function removeFilter(filter: Filter) {
  return {
    type: 'REMOVE_FILTER',
    payload: filter,
  };
}

export function setFilters(filters: Filter[]) {
  return {
    type: 'SET_FILTERS',
    payload: filters,
  };
}

export function clearFilters() {
  return {
    type: 'CLEAR_FILTERS',
  };
}

export function selectOptionInFilter(filter: Filter, option: FilterOption) {
  return {
    type: 'SELECT_OPTION_IN_FILTER',
    payload: {
      filter,
      option,
    },
  };
}

export function unselectOptionInFilter<T, U>(
  filter: Filter,
  option: FilterOption
) {
  return {
    type: 'UNSELECT_OPTION_IN_FILTER',
    payload: {
      filter,
      option,
    },
  };
}

export function clearSelectedOptionsInFilter(filter: Filter) {
  return {
    type: 'CLEAR_SELECTED_OPTIONS_IN_FILTER',
    payload: {
      filter,
    },
  };
}

export function resetSelectedOptions() {
  return {
    type: 'RESET_SELECTED_OPTIONS',
  };
}

export function clearSelectedOptions() {
  return {
    type: 'CLEAR_SELECTED_OPTIONS',
  };
}

export function applySelectedOptions() {
  return {
    type: 'APPLY_SELECTED_OPTIONS',
  };
}

export function clearAppliedOptions() {
  return {
    type: 'CLEAR_APPLIED_OPTIONS',
  };
}
