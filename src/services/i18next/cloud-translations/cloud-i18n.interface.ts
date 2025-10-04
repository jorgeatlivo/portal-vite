export interface CloudI18nBundle {
  languageCode: string;
  namespace: string;
  resources: Record<string, string>;
  lastUpdated?: Date;
  version?: string;
}

export interface CloudI18nService {
  localBundleVersion: string | number;

  /**
   * Load translation bundles from local storage
   */
  loadLocalBundle(lng: string, namespaces: string[]): Promise<void>;

  /**
   * Fetch multiple bundles at once
   */
  fetchBundles(
    languages: string[],
    namespaces: string[]
  ): Promise<CloudI18nBundle[]>;

  /**
   * Check if there are updates available for a bundle
   */
  checkUpdates(
    language: string,
    namespace: string[]
  ): Promise<Record<string, boolean>>;
}
