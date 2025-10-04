import axios, { AxiosError } from 'axios';

import { getCurrentLocale } from '@/services/i18next/i18next';

import {
  FacilityDataFieldDefinition,
  InternalProfessional,
  InvitationStatus,
} from '@/types/internal';

import { ShiftClaimDetails } from '@/types';
/* eslint-disable */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //TODO ENV VARIABLE
  timeout: 30000, // Set the request timeout
  headers: {
    accept: '*/*',
    'X-locale': getCurrentLocale(),
  },
});

type InterceptorEjectionCallback = () => void;

export class ApiApplicationError extends Error {
  public errorCode?: string;
  public errorMessage?: string;
  public extraData?: any;

  constructor(
    message: string,
    errorCode?: string,
    errorMessage?: string,
    extraData?: any
  ) {
    super(message);
    this.name = 'ApiApplicationError';
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.extraData = extraData;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiApplicationError);
    }
  }
}

export function isCustomApiError(obj: any): boolean {
  return 'extraData' in obj;
}

export function isDenarioNotSyncedError(obj: any): boolean {
  return isCustomApiError(obj) && obj.errorCode === '60001';
}

export function handleApiError(error: AxiosError | unknown): never {
  if (error instanceof AxiosError) {
    if (!error.response) {
      if (error.message.includes('Network Error')) {
        // Refresh the page to show the browser's "No Internet Connection" screen
        // window.location.reload();
        // return;
        throw new ApiApplicationError('No tienes conexión a internet');
      }
      throw new ApiApplicationError('El servidor no responde.');
    }
    if (error.response && error.response.status % 400 < 100) {
      const responseData = error.response.data as {
        errorMessage?: string;
        errorCode?: string;
        extraData?: any;
      };
      // @ts-ignore
      const message = responseData?.errorMessage;
      const errorCode = responseData?.errorCode;
      const extraData = responseData?.extraData;
      if (message) {
        throw new ApiApplicationError(message, errorCode, message, extraData);
      } else {
        throw new ApiApplicationError('Error de conexión con el servidor.');
      }
      // @ts-ignore
    } else if (error.request) {
      throw new ApiApplicationError('El servidor no responde.');
    }

    throw error;
  }

  throw new ApiApplicationError(
    'Error desconocido al procesar la solicitud.',
    'UNKNOWN_ERROR',
    'Error desconocido al procesar la solicitud.'
  );
}

export function fetchLegalReviewDetails(
  shiftClaimId: number
): Promise<ShiftClaimDetails> {
  const uri = `/facility/approved-shift-claim/${shiftClaimId}/legal-review/get-details`;

  return api
    .get(uri)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? token : '';
  config.headers.set('X-locale', getCurrentLocale());
  return config;
});

interface ContactInfo {
  email: string;
  phoneNumber: string;
  whatsappLink: string;
}
export function fetchContactInfo(): Promise<ContactInfo> {
  const uri = '/facility/livo-contact-information';
  return api
    .get(uri)
    .then((response) => {
      return response.data;
    })
    .catch(handleApiError);
}

type FetchShiftResponse = {
  total: number;
  rows: ShiftClaimDetails[];
};

export function fetchLegalReviewList(filter: any): Promise<FetchShiftResponse> {
  const queryParams = new URLSearchParams({ ...filter });
  const uri = `/facility/approved-shift-claim/legal-review/get-list?${queryParams.toString()}`;

  return api
    .get(uri)
    .then((response) => {
      return response.data ? response.data : { rows: [], total: 0 };
    })
    .catch(handleApiError);
}

type FetchInternalProfessionalsResponse = {
  total: number;
  rows: InternalProfessional[];
  dataFieldDefinitions: FacilityDataFieldDefinition[];
};

export type InternalProfessionalFilter = {
  search?: string;
  page?: string;
  size?: string;
  invitationStatus?: InvitationStatus;
};
export function fetchInternalProfessionals(
  filter: InternalProfessionalFilter
): Promise<FetchInternalProfessionalsResponse> {
  const queryParams = new URLSearchParams({ ...filter });
  const uri = `/facility/portal/internal-professionals?${queryParams.toString()}`;

  return api
    .get(uri)
    .then((response) => {
      return response.data ? response.data : { rows: [], total: 0 };
    })
    .catch(handleApiError);
}

type ProfessionalBulkUploadResponse = {
  totalSuccess: number;
};

export function bulkUploadInternalProfessionals(
  file: FormData
): Promise<ProfessionalBulkUploadResponse> {
  const uri = `/facility/internal-professionals/bulk-upload`;

  return api
    .post(uri, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data;
    });
}

export interface SignInRequestData {
  userName: string;
  password: string;
}

export interface SignInResponseData {
  errorMessage: string;
  userToken: string;
  mfaEnabled?: boolean;
}

export const signInRequest = (
  signInData: SignInRequestData
): Promise<SignInResponseData> => {
  const url = '/facility/account/sign-in';

  return api
    .post(url, signInData, {
      headers: {
        accept: '*/*',
      },
    })
    .then((response) => {
      const { accessToken, tokenType, mfaEnabled } = response.data;

      return {
        userToken: `${tokenType} ${accessToken}`,
        errorMessage: '',
        mfaEnabled,
      };
    })
    .catch((error) => {
      return {
        userToken: '',
        errorMessage: error.response.data.errorMessage,
      };
    });
};

export const confirmRequest = (shiftClaimId: number) => {
  const uri = `facility/approved-shift-claim/${shiftClaimId}/legal-review/confirm-professional-legal-profile`;
  return api
    .post(uri)
    .then((response) => response.status === 200)
    .catch(handleApiError);
};

export function configureUnauthorizedApi(
  logoutDispatch: () => void
): InterceptorEjectionCallback {
  let onFulfilled = (response: any) => response;
  let getOnRejected = (error: any) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      logoutDispatch();
      error.response.data = { errorMessage: 'INVALID_CREDENTIALS_ERROR' };
    }
    return Promise.reject(error);
  };

  let interceptor = api.interceptors.response.use(onFulfilled, getOnRejected);
  return () => api.interceptors.response.eject(interceptor);
}

export function downloadZipFile(shiftClaimId: number) {
  const uri = `facility/approved-shift-claim/${shiftClaimId}/legal-review/download-zip`;

  return api
    .get(uri, { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      // get file name from Content-Disposition header
      const fileName =
        response.headers['content-disposition'].split('filename=')[1];
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
    })
    .catch(handleApiError);
}
