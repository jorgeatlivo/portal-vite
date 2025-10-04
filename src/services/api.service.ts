import { AxiosNetworkClient } from '@/services/network-clients/axios-network-client.service';
import {
  INetworkClient,
  NetworkClientConfig,
} from '@/services/network-clients/network-client.interface';

export enum APIServiceName {
  PUBLIC = 'public',
  AUTHORIZED = 'authorized',
}

export class APIService {
  private client: INetworkClient | null = null;

  private static instancesPool = new Map<string, APIService>();

  private constructor() {}

  static getAllInstances(): Map<string, APIService> {
    return APIService.instancesPool;
  }

  static getInstance(name: APIServiceName = APIServiceName.PUBLIC): APIService {
    if (!APIService.instancesPool.has(name)) {
      const apiService = new APIService();
      apiService.useClient(
        new AxiosNetworkClient(import.meta.env.VITE_API_BASE_URL ?? '')
      );
      APIService.instancesPool.set(name, apiService);
      return apiService;
    }

    return APIService.instancesPool.get(name) as APIService;
  }

  static removeInstance(name: string) {
    if (APIService.instancesPool.has(name)) {
      APIService.instancesPool.delete(name);
    }
  }

  static clearPool() {
    APIService.instancesPool.clear();
  }

  updateConfig(config: NetworkClientConfig) {
    if (this.client) {
      this.client.updateConfig(config);
    }
  }

  private useClient(client: INetworkClient): void {
    this.client = client;
  }

  async get<T>(url: string, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.delete<T>(url, config);
  }
  async head<T>(url: string, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.head<T>(url, config);
  }

  async options<T>(url: string, config?: any) {
    if (!this.client) {
      throw new Error(NO_NETWORK_CLIENT_ERROR);
    }
    return this.client.options<T>(url, config);
  }
}

const NO_NETWORK_CLIENT_ERROR =
  'No NetworkClient is configured. Use `APIService.useClient()` first.';
