import { APIService, APIServiceName } from '@/services/api.service';

import { SortingOptionsEnum } from '@/components/common/SortingSelector';

import { RecurrencyOptionsEnum } from '@/types/publish-shift';
import {
  DayShift,
  FilterConfiguration,
  Shift,
  SpecializationDTO,
} from '@/types/shifts';

import { handleApiError } from './api';

type FetchShiftParams = {
  fromDate?: string;
  toDate?: string;
  sortOrder?: string;
  withPendingClaims?: boolean;
  isFilled?: boolean;
  sortBy?: SortingOptionsEnum;
  professionalIds?: string;
  units?: string;
};

export function fetchShifts(
  fromDate?: string,
  toDate?: string,
  ordering: 'ASC' | 'DESC' = 'ASC',
  filters: FilterConfiguration = {},
  sortBy?: SortingOptionsEnum,
  professionalIds?: string[],
  units?: string[]
) {
  const uri = '/facility/portal/shifts';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  const params: FetchShiftParams = {};
  if (fromDate) {
    params.fromDate = fromDate;
  }
  if (toDate) {
    params.toDate = toDate;
  }

  if (ordering) {
    params.sortOrder = ordering;
  }

  if (sortBy) {
    params.sortBy = sortBy;
  }

  if (professionalIds?.length) {
    params.professionalIds = professionalIds.join(',');
  }

  if (units?.length) {
    params.units = units.join(',');
  }

  return api
    .get<DayShift[]>(uri, {
      params: {
        ...params,
        ...filters,
      },
    })
    .catch(handleApiError);
}

export type ShiftSummary = {
  date: string;
  hasAlert: boolean;
  totalShifts: number;
  holiday?: boolean;
};

export function fetchShiftsSummary(
  fromDate?: string,
  toDate?: string,
  categories?: string[],
  units?: string[]
) {
  //format is YYYY-MM-DD
  const uri = '/facility/portal/shifts/shifts-summary';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  const params: {
    fromDate?: string;
    toDate?: string;
    categories?: string[];
    units?: string[];
  } = {};

  if (fromDate) {
    params['fromDate'] = fromDate;
  }
  if (toDate) {
    params['toDate'] = toDate;
  }
  if (categories) {
    params['categories'] = categories;
  }
  if (units) {
    params['units'] = units;
  }

  return api.get<ShiftSummary[]>(uri, { params }).catch((error) => {
    return handleApiError(error);
  });
}

export function fetchShiftDetails(shiftId: number) {
  const uri = `/facility/portal/shifts/${shiftId}`;
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.get<Shift>(uri).catch(handleApiError);
}

export async function cancelShiftRequest(
  shiftId: number,
  cancelReason: string,
  reasonDetails: string,
  bulkOperation?: RecurrencyOptionsEnum
) {
  try {
    const uri = `/facility/portal/shifts/${shiftId}/cancel-shift`;
    const api = APIService.getInstance(APIServiceName.AUTHORIZED);
    const body = {
      reason: cancelReason,
      reasonDetails,
      bulkOperation,
    };

    await api.post(uri, body);
    return true;
  } catch (error) {
    handleApiError(error);
  }
}

export function fetchShiftCancelReasons() {
  const uri = '/facility/common/shift-cancel-reasons';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  return api.get<SpecializationDTO[]>(uri).catch(handleApiError);
}

export interface ShiftUpdateRequest {
  startTime: Date;
  endTime: Date;
  totalPay: number;
  details: string | null;
  unit?: string;
  capacity?: number;
  internalVisible: boolean;
  externalVisible: boolean;
  decreaseCapacityReason?: string;
  decreaseCapacityReasonDetails?: string;
  bulkOperation?: RecurrencyOptionsEnum;
  unitVisible: boolean;
  invitedProfessionalIds?: number[];
}

export async function updateShiftRequest(
  shiftId: number,
  shiftRequest: ShiftUpdateRequest
) {
  try {
    const uri = `/facility/portal/shifts/${shiftId}/update-shift`;
    const api = APIService.getInstance(APIServiceName.AUTHORIZED);

    await api.post(uri, shiftRequest);
    return true;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateCapacityRequest(
  shiftId: number,
  newCapacity: number,
  cancelReason?: string,
  reasonDetails?: string
) {
  try {
    const uri = `/facility/portal/shifts/${shiftId}/change-capacity`;
    const api = APIService.getInstance(APIServiceName.AUTHORIZED);

    const body = {
      capacity: newCapacity,
      reason: cancelReason,
      reasonDetails,
    };

    await api.post(uri, body);
    return true;
  } catch (error) {
    handleApiError(error);
  }
}

export interface PaginatedShiftsResponse {
  page: number;
  finalPage: boolean;
  shiftsByDate: DayShift[];
  totalShifts: number;
}

export function fetchPaginatedShifts(
  page: number = 1,
  size: number = 30,
  fromDate?: string,
  toDate?: string,
  ordering: 'ASC' | 'DESC' = 'ASC',
  filters: FilterConfiguration = {},
  sortBy?: SortingOptionsEnum,
  professionalIds?: string[],
  units?: string[]
) {
  const uri = '/facility/portal/shifts/pagination';
  const api = APIService.getInstance(APIServiceName.AUTHORIZED);

  const params: FetchShiftParams & { page: number; size: number } = {
    page,
    size,
  };

  if (fromDate) {
    params.fromDate = fromDate;
  }
  if (toDate) {
    params.toDate = toDate;
  }
  if (ordering) {
    params.sortOrder = ordering;
  }
  if (sortBy) {
    params.sortBy = sortBy;
  }
  if (professionalIds?.length) {
    params.professionalIds = professionalIds.join(',');
  }
  if (units?.length) {
    params.units = units.join(',');
  }

  return api
    .get<PaginatedShiftsResponse>(uri, {
      params: {
        ...params,
        ...filters,
      },
    })
    .catch(handleApiError);
}
