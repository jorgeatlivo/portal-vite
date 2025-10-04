import { ProfessionalFiltersAction } from '@/store/types';

import { Filter } from '@/types/common/shiftFilters';

export function professionalFiltersReducer(
  state = { filters: [] as Filter[] },
  action: ProfessionalFiltersAction
) {
  let filters;

  switch (action.type) {
    case 'ADD_PROFESSIONAL_FILTER':
      filters = [...state.filters, action.payload];
      return {
        ...state,
        filters,
      };
    case 'REMOVE_PROFESSIONAL_FILTER':
      filters = state.filters.filter((f) => f !== action.payload);
      return {
        ...state,
        filters,
      };
    case 'SET_PROFESSIONAL_FILTERS':
      filters = action.payload;
      return {
        ...state,
        filters,
      };
    case 'CLEAR_PROFESSIONAL_FILTERS':
      filters = [] as Filter[];
      return {
        ...state,
        filters,
      };
    case 'SELECT_OPTION_IN_PROFESSIONAL_FILTER':
      filters = state.filters.map((filter) => {
        if (
          filter === action.payload.filter &&
          !filter.selectedOptions.includes(action.payload.option)
        ) {
          return {
            ...filter,
            selectedOptions: [...filter.selectedOptions, action.payload.option],
          };
        } else {
          return filter;
        }
      });
      return {
        ...state,
        filters,
      };
    case 'UNSELECT_OPTION_IN_PROFESSIONAL_FILTER':
      filters = state.filters.map((filter) => {
        if (filter === action.payload.filter) {
          return {
            ...filter,
            selectedOptions: filter.selectedOptions.filter(
              (option) => option !== action.payload.option
            ),
          };
        } else {
          return filter;
        }
      });
      return {
        ...state,
        filters,
      };
    case 'CLEAR_PROFESSIONAL_FILTER_SELECTED_OPTIONS_FOR_FILTER':
      filters = state.filters.map((filter) => {
        if (filter === action.payload.filter) {
          return {
            ...filter,
            selectedOptions: [],
          };
        } else {
          return filter;
        }
      });
      return {
        ...state,
        filters,
      };
    case 'RESET_SELECTED_PROFESSIONAL_FILTERS_OPTIONS':
      filters = state.filters.map((filter) => {
        return {
          ...filter,
          selectedOptions: filter.appliedOptions,
        };
      });
      return {
        ...state,
        filters,
      };
    case 'APPLY_SELECTED_PROFESSIONAL_FILTERS_OPTIONS':
      filters = state.filters.map((filter) => {
        return {
          ...filter,
          appliedOptions: filter.selectedOptions,
        };
      });
      return {
        ...state,
        filters,
      };
    case 'CLEAR_APPLIED_PROFESSIONAL_FILTERS_OPTIONS':
      filters = state.filters.map((filter) => {
        return {
          ...filter,
          appliedOptions: [],
        };
      });
      return {
        ...state,
        filters,
      };
    default:
      return state;
  }
}
