import { Logger } from '@/services/logger.service';

import { CloudI18nService } from './cloud-i18n.interface';

class CloudTranslationManager {
  private static instance: CloudTranslationManager;
  private translationService: CloudI18nService;

  private constructor(ServiceClass: new () => CloudI18nService) {
    this.translationService = new ServiceClass();
  }

  /**
   * Initialize singleton instance with a specific translation service class
   */
  public static getInstance(
    ServiceClass: new () => CloudI18nService
  ): CloudTranslationManager {
    if (!CloudTranslationManager.instance) {
      CloudTranslationManager.instance = new CloudTranslationManager(
        ServiceClass
      );
    }
    return CloudTranslationManager.instance;
  }

  /**
   * Load local translations before fetching updates
   */
  public async init(lng: string, namespaces: string[]) {
    await this.translationService.loadLocalBundle(lng, namespaces);
    await this.updateIfNeeded(lng, namespaces);
  }

  /**
   * Check for updates and fetch new translations if needed
   */
  public async updateIfNeeded(lng: string, namespaces: string[]) {
    const updates = await this.translationService.checkUpdates(lng, namespaces);

    const namespacesToUpdate = Object.keys(updates).filter((ns) => updates[ns]);

    if (namespacesToUpdate.length > 0) {
      Logger.debug(
        `🔄 Updating translations for namespaces: ${namespacesToUpdate.join(', ')}`
      );
      await this.translationService.fetchBundles([lng], namespacesToUpdate);
    }
  }
}

export default CloudTranslationManager;
