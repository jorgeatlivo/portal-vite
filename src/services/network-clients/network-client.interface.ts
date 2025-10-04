/**
 * Network client interface
 * Use to define the network client
 * Like axios, fetch, etc.
 * Any network client should implement this interface
 */
export type NetworkClientConfig = {
  token?: string;
  accept?: string;
  locale?: string;
};

export interface INetworkClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
  patch<T>(url: string, data?: any, config?: any): Promise<T>;
  head<T>(url: string, config?: any): Promise<T>;
  options<T>(url: string, config?: any): Promise<T>;

  updateConfig: (config: NetworkClientConfig) => void;
}
