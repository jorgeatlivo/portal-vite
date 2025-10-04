import { AccountInfo } from '@/services/account';
import { PortalProfessionalSearchVo } from '@/services/professionals';

import { ClaimRequest } from '@/types/claims';
import { Filter, FilterOption } from '@/types/common/shiftFilters';
import { Shift } from '@/types/shifts';

export type PublishShiftListAction =
  | {
      type: 'SET_FILTER';
      payload: string;
    }
  | {
      type: 'SET_PUBLISH_SHIFT_LIST_SELECTED_SHIFT_ID';
      payload: number;
    };

export type PendingRequestsAction = {
  type: 'SET_PENDING_REQUESTS_COUNT';
  payload: number;
};

export type ActivityShiftListAction = {
  type: 'SET_ACTIVITY_SHIFT_LIST_SHIFTS';
  payload: Shift[];
};
export interface PendingRequestsState {
  count: number;
}

export type ActivityShiftListState = {
  shifts: Shift[];
};

export type AccountState = {
  accountInfo: AccountInfo | null;
};

export type AppConfigurationState = {
  toast: Toast | null;
  internetConnection: boolean;
};

export type RootState = {
  activityShiftList: ActivityShiftListState;
  account: AccountState;
  appConfiguration: AppConfigurationState;
  filterShifts: FiltersState;
  pendingRequests: PendingRequestsState;
  claimData: ClaimState;
  professionalFilters: ProfessionalFiltersState;
};

export type AccountAction = {
  type: 'SET_ACCOUNT_INFO';
  payload: AccountInfo;
};

export type Toast = {
  message: string;
  severity: 'error' | 'success';
};

export type AppConfigurationAction =
  | {
      type: 'SHOW_TOAST';
      payload: Toast;
    }
  | {
      type: 'HIDE_TOAST';
    }
  | {
      type: 'TOGGLE_INTERNET_CONNECTION';
      payload: boolean;
    };

export type FiltersState = {
  filters: Filter[];
  selectedProfessionals: PortalProfessionalSearchVo[];
};

export type ProfessionalFiltersState = {
  filters: Filter[];
};

export type FiltersAction =
  | {
      type: 'ADD_FILTER';
      payload: Filter;
    }
  | {
      type: 'REMOVE_FILTER';
      payload: Filter;
    }
  | {
      type: 'SET_FILTERS';
      payload: Filter[];
    }
  | {
      type: 'CLEAR_FILTERS';
    }
  | {
      type: 'SELECT_OPTION_IN_FILTER';
      payload: {
        filter: Filter;
        option: FilterOption;
      };
    }
  | {
      type: 'UNSELECT_OPTION_IN_FILTER';
      payload: {
        filter: Filter;
        option: FilterOption;
      };
    }
  | {
      type: 'CLEAR_SELECTED_OPTIONS_IN_FILTER';
      payload: {
        filter: Filter;
      };
    }
  | {
      type: 'RESET_SELECTED_OPTIONS';
    }
  | {
      type: 'CLEAR_SELECTED_OPTIONS';
    }
  | {
      type: 'APPLY_SELECTED_OPTIONS';
    }
  | {
      type: 'CLEAR_APPLIED_OPTIONS';
    }
  | {
      type: 'SET_SELECTED_PROFESSIONALS';
      payload: PortalProfessionalSearchVo[];
    };

export type ProfessionalFiltersAction =
  | {
      type: 'ADD_PROFESSIONAL_FILTER';
      payload: Filter;
    }
  | {
      type: 'REMOVE_PROFESSIONAL_FILTER';
      payload: Filter;
    }
  | {
      type: 'SET_PROFESSIONAL_FILTERS';
      payload: Filter[];
    }
  | {
      type: 'CLEAR_PROFESSIONAL_FILTERS';
    }
  | {
      type: 'SELECT_OPTION_IN_PROFESSIONAL_FILTER';
      payload: {
        filter: Filter;
        option: FilterOption;
      };
    }
  | {
      type: 'UNSELECT_OPTION_IN_PROFESSIONAL_FILTER';
      payload: {
        filter: Filter;
        option: FilterOption;
      };
    }
  | {
      type: 'CLEAR_PROFESSIONAL_FILTER_SELECTED_OPTIONS_FOR_FILTER';
      payload: {
        filter: Filter;
      };
    }
  | {
      type: 'RESET_SELECTED_PROFESSIONAL_FILTERS_OPTIONS';
    }
  | {
      type: 'CLEAR_PROFESSIONAL_FILTER_SELECTED_OPTIONS';
    }
  | {
      type: 'APPLY_SELECTED_PROFESSIONAL_FILTERS_OPTIONS';
    }
  | {
      type: 'CLEAR_APPLIED_PROFESSIONAL_FILTERS_OPTIONS';
    };

export type ClaimAction =
  | { type: 'CLAIM_INFO_LOADING' }
  | { type: 'CLAIM_INFO_NOT_LOADING' }
  | { type: 'LOAD_CLAIM_INFO'; payload: ClaimRequest };

export type ClaimState = {
  claimRequest: ClaimRequest;
  isLoading: boolean;
};

export type ClaimSummary = {
  professionalId: number;
  shiftId: number;
  claimId: number;
};
