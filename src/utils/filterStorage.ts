import { PortalProfessionalSearchVo } from '@/services/professionals';

const FILTER_STORAGE_KEY = 'shift_filters';

export interface FilterState {
  key: string;
  selectedOptionIds: string[];
  appliedOptionIds: string[];
}

interface FilterStateStorage {
  filters: FilterState[];
  selectedProfessionals: PortalProfessionalSearchVo[];
}

export const saveFiltersToStorage = (
  filters: { key: string; selectedOptions: any[]; appliedOptions: any[] }[]
) => {
  const filterState = filters.map((filter) => ({
    key: filter.key,
    selectedOptionIds: filter.selectedOptions.map((opt) =>
      'code' in opt ? opt.code : opt.value
    ),
    appliedOptionIds: filter.appliedOptions.map((opt) =>
      'code' in opt ? opt.code : opt.value
    ),
  }));

  const existingState = getFilterState();
  localStorage.setItem(
    FILTER_STORAGE_KEY,
    JSON.stringify({
      ...existingState,
      filters: filterState,
    })
  );
};

const getFilterState = (): FilterStateStorage => {
  const storedState = localStorage.getItem(FILTER_STORAGE_KEY);
  if (!storedState) return { filters: [], selectedProfessionals: [] };

  try {
    return JSON.parse(storedState);
  } catch (error) {
    return { filters: [], selectedProfessionals: [] };
  }
};

export const getFiltersStateFromStorage = (): FilterState[] => {
  return getFilterState().filters;
};

export const saveSelectedProfessionalsToStorage = (
  professionals: PortalProfessionalSearchVo[]
) => {
  const existingState = getFilterState();
  localStorage.setItem(
    FILTER_STORAGE_KEY,
    JSON.stringify({
      ...existingState,
      selectedProfessionals: professionals,
    })
  );
};

export const getSelectedProfessionalsFromStorage =
  (): PortalProfessionalSearchVo[] => {
    return getFilterState().selectedProfessionals;
  };

export const clearFilterStorage = () => {
  localStorage.removeItem(FILTER_STORAGE_KEY);
};
