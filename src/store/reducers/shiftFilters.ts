import { FiltersAction, FiltersState } from '@/store/types';

import { Filter, FilterOption } from '@/types/common/shiftFilters';
import {
  getFiltersStateFromStorage,
  getSelectedProfessionalsFromStorage,
  saveFiltersToStorage,
  saveSelectedProfessionalsToStorage,
} from '@/utils/filterStorage';

const initialState: FiltersState = {
  filters: [],
  selectedProfessionals: getSelectedProfessionalsFromStorage(),
};

const updateAndSaveFilters = (
  state: FiltersState,
  filters: Filter[]
): FiltersState => {
  saveFiltersToStorage(filters);
  return {
    ...state,
    filters,
  };
};

export function shiftFiltersReducer(
  state = initialState,
  action: FiltersAction
): FiltersState {
  switch (action.type) {
    case 'SET_FILTERS': {
      const savedState = getFiltersStateFromStorage();

      const filters = action.payload.map((filter) => {
        const savedFilter = savedState.find((sf) => sf.key === filter.key);
        if (!savedFilter) return filter;

        const selectedOptions = savedFilter.selectedOptionIds
          .map((id) =>
            filter.options.find((opt) =>
              'code' in opt ? opt.code === id : opt.value === id
            )
          )
          .filter((opt): opt is FilterOption => opt !== undefined);

        const appliedOptions = savedFilter.appliedOptionIds
          .map((id) =>
            filter.options.find((opt) =>
              'code' in opt ? opt.code === id : opt.value === id
            )
          )
          .filter((opt): opt is FilterOption => opt !== undefined);

        return {
          ...filter,
          selectedOptions,
          appliedOptions,
        };
      });

      return updateAndSaveFilters(state, filters);
    }

    case 'ADD_FILTER':
      return updateAndSaveFilters(state, [...state.filters, action.payload]);

    case 'REMOVE_FILTER':
      return updateAndSaveFilters(
        state,
        state.filters.filter((f) => f !== action.payload)
      );

    case 'CLEAR_FILTERS':
      return updateAndSaveFilters(state, []);

    case 'SELECT_OPTION_IN_FILTER': {
      const filters = state.filters.map((filter) => {
        if (filter !== action.payload.filter) return filter;
        if (filter.selectedOptions.includes(action.payload.option))
          return filter;

        return {
          ...filter,
          selectedOptions: [...filter.selectedOptions, action.payload.option],
        };
      });
      return updateAndSaveFilters(state, filters);
    }

    case 'UNSELECT_OPTION_IN_FILTER': {
      const filters = state.filters.map((filter) =>
        filter === action.payload.filter
          ? {
              ...filter,
              selectedOptions: filter.selectedOptions.filter(
                (opt) => opt !== action.payload.option
              ),
            }
          : filter
      );
      return updateAndSaveFilters(state, filters);
    }

    case 'CLEAR_SELECTED_OPTIONS_IN_FILTER':
    case 'CLEAR_SELECTED_OPTIONS': {
      const filters = state.filters.map((filter) => ({
        ...filter,
        selectedOptions:
          action.type === 'CLEAR_SELECTED_OPTIONS_IN_FILTER' &&
          filter !== action.payload.filter
            ? filter.selectedOptions
            : [],
      }));
      return updateAndSaveFilters(state, filters);
    }

    case 'RESET_SELECTED_OPTIONS': {
      const filters = state.filters.map((filter) => ({
        ...filter,
        selectedOptions: filter.appliedOptions,
      }));
      return updateAndSaveFilters(state, filters);
    }

    case 'APPLY_SELECTED_OPTIONS': {
      const filters = state.filters.map((filter) => ({
        ...filter,
        appliedOptions: filter.selectedOptions,
      }));
      return updateAndSaveFilters(state, filters);
    }

    case 'CLEAR_APPLIED_OPTIONS': {
      const filters = state.filters.map((filter) => ({
        ...filter,
        appliedOptions: [],
      }));
      return updateAndSaveFilters(state, filters);
    }

    case 'SET_SELECTED_PROFESSIONALS': {
      saveSelectedProfessionalsToStorage(action.payload);
      return {
        ...state,
        selectedProfessionals: action.payload,
      };
    }

    default:
      return state;
  }
}
