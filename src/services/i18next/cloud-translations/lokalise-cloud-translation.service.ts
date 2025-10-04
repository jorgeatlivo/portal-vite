import i18n from 'i18next';

import { Logger } from '@/services/logger.service';

import { CloudI18nBundle, CloudI18nService } from './cloud-i18n.interface';
import TranslationStorage from './translation-storage.service';

const LOKALISE_PROJECT_ID = process.env.REACT_APP_LOKALISE_PROJECT_ID ?? '';
const LOKALISE_API_KEY = process.env.REACT_APP_LOKALISE_API_KEY ?? '';
const LOKALISE_OTA_URL = `https://ota.lokalise.com/v3/lokalise/projects/${LOKALISE_PROJECT_ID}/frameworks/android_sdk`;

class LokaliseTranslationService implements CloudI18nService {
  public localBundleVersion: string | number = 0;
  public bundleUrl: string = '';
  public __bundleVersion = 0;

  constructor() {
    this.loadBundleVersionFromCache();
  }

  /**
   * Load the stored bundle version from IndexedDB
   */
  private async loadBundleVersionFromCache() {
    this.localBundleVersion = await TranslationStorage.getBundleVersion();
  }

  /**
   * Load translations from IndexedDB if available
   */
  public async loadLocalBundle(
    lng: string,
    namespaces: string[]
  ): Promise<void> {
    const promises = [];
    for (const ns of namespaces) {
      promises.push(TranslationStorage.getTranslations(ns, lng));
    }
    const translations = await Promise.all(promises);
    translations.forEach((data, index) => {
      if (data) {
        i18n.addResourceBundle(lng, namespaces[index], data, true, true);
      }
    });
  }

  private fetchLokalise() {
    const params = {
      prerelease: false,
      appVersion: '99.0.9',
      // transVersion: `${this.localBundleVersion ?? 0}`,
      transVersion: '0',
    };

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-ota-api-token': LOKALISE_API_KEY,
      },
    };
    const paramsString = Object.keys(params)
      .map((key) => {
        return key + '=' + params[key as keyof typeof params] ?? '';
      })
      .join('&');

    return fetch(LOKALISE_OTA_URL + '?' + paramsString, options);
  }

  /**
   * Fetch latest OTA bundle from Lokalise and update translations
   */
  public async fetchBundles(
    languages: string[],
    namespaces: string[]
  ): Promise<CloudI18nBundle[]> {
    try {
      if (!this.bundleUrl) {
        return [];
      }

      // Fetch translations
      const bundleResponse = await fetch(this.bundleUrl);
      const translations: LokaliseBundle[] = await bundleResponse.json();

      const bundles: CloudI18nBundle[] = [];

      for (const lang of languages) {
        const langPack = translations.find((b) => b.iso === lang);
        if (!langPack) continue;

        const parsed = this.parseLanguageFromLokalise(
          lang,
          langPack.items,
          namespaces
        );

        for (const ns of namespaces) {
          const nsBundle = parsed[ns];
          if (!nsBundle) continue;

          const bundle: CloudI18nBundle = {
            languageCode: lang,
            namespace: ns,
            resources: nsBundle,
            lastUpdated: new Date(),
            version: String(this.localBundleVersion),
          };

          await TranslationStorage.saveTranslations(ns, lang, bundle.resources);
          i18n.addResourceBundle(lang, ns, bundle.resources, true, true);
          bundles.push(bundle);
        }
      }
      await TranslationStorage.saveBundleVersion(this.__bundleVersion);
      this.localBundleVersion = this.__bundleVersion;
      return bundles;
    } catch (error) {
      Logger.error('Error fetching OTA translations:', error);
      throw error;
    }
  }

  /**
   * Check if there are updates available for multiple namespaces
   */
  public async checkUpdates(
    language: string,
    namespaces: string[]
  ): Promise<Record<string, boolean>> {
    try {
      const response = await this.fetchLokalise();

      if (!response.ok) {
        throw new Error('Failed to check updates from Lokalise');
      }

      const bundleInfo: {
        data: {
          url: string;
          version: number;
        };
      } = await response.json();
      const latestVersion = bundleInfo.data.version;
      this.__bundleVersion = latestVersion;
      const localVersion = await TranslationStorage.getBundleVersion();

      const updatesNeeded: Record<string, boolean> = {};
      const needsUpdate = latestVersion > localVersion;
      this.bundleUrl = bundleInfo.data.url;

      namespaces.forEach((ns) => {
        updatesNeeded[ns] = needsUpdate;
      });

      return updatesNeeded;
    } catch (error) {
      Logger.error('Error checking translation updates:', error);
      return namespaces.reduce((acc, ns) => ({ ...acc, [ns]: false }), {});
    }
  }

  private parseLanguageFromLokalise(
    lang: string,
    items: LokaliseItem[],
    namespaceArray: string[]
  ): Record<string, Record<string, string>> {
    const namespacesMap: Record<string, Record<string, string>> = {};
    const leanNSMap = this.transformNamespacesToAndroidResource(namespaceArray);

    /**
     * because android string resource not support "/" and "-" in key
     */
    items.forEach((item) => {
      const [ns, ...values] = item.key.split('__');
      const key = values.join('__');
      // convert from snake_case to kebab-case
      const realNamespace = leanNSMap[ns];
      if (!namespacesMap[realNamespace]) {
        namespacesMap[realNamespace] = {};
      }
      namespacesMap[realNamespace][key] = item.value;
    });
    return namespacesMap;
  }

  private transformNamespacesToAndroidResource(
    namespaces: string[]
  ): Record<string, string> {
    const leanNamespacesMap: Record<string, string> = {};
    namespaces.forEach((namespace) => {
      const ns = namespace.replace(/-/g, '_').replace('/', '');
      leanNamespacesMap[ns] = namespace;
    });
    return leanNamespacesMap;
  }
}

type LokaliseItem = { key: string; type: number; value: string };

type LokaliseBundle = {
  is_default: number;
  iso: string;
  items: LokaliseItem[];
};

export default LokaliseTranslationService;
