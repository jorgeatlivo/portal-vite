// src/network/AxiosNetworkClient.ts

import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { getCurrentLocale } from '@/services/i18next/i18next';

import {
  INetworkClient,
  NetworkClientConfig,
} from './network-client.interface';

export class AxiosNetworkClient implements INetworkClient {
  private axiosInstance: AxiosInstance;

  constructor(
    baseURL: string,
    _config?: {
      timeout?: number;
      token?: string;
    }
  ) {
    const { token, timeout } = _config ?? {};
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: '*/*',
        Authorization: token ? `Bearer ${token}` : undefined,
        'X-locale': getCurrentLocale(),
      },
      timeout,
    });
  }

  updateConfig(config: NetworkClientConfig) {
    if (config.token) {
      this.axiosInstance.defaults.headers.Authorization = config.token;
    }
    if (config.accept) {
      this.axiosInstance.defaults.headers.Accept = config.accept;
    }
    if (config.locale) {
      this.axiosInstance.defaults.headers['X-locale'] = config.locale;
    }
  }

  async get<T>(url: string, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.get<T>(
      url,
      config
    );
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.post<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.put<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T>(url: string, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.delete<T>(
      url,
      config
    );
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.patch<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  async head<T>(url: string, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.head<T>(
      url,
      config
    );
    return response.data;
  }

  async options<T>(url: string, config?: any) {
    const response: AxiosResponse<T> = await this.axiosInstance.options<T>(
      url,
      config
    );
    return response.data;
  }
}
