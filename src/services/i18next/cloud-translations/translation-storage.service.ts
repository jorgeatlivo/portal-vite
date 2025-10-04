class TranslationStorage {
  private static db: IDBDatabase | null = null;
  private static readonly DB_NAME = 'translations_db';
  private static readonly STORE_NAME = 'translations';
  private static readonly STORE_VERSION = 1;

  /**
   * Initialize IndexedDB if not already opened
   */
  private static async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (TranslationStorage.db) return resolve(TranslationStorage.db);

      const request = indexedDB.open(
        TranslationStorage.DB_NAME,
        TranslationStorage.STORE_VERSION
      );
      request.onerror = () => reject('Error opening IndexedDB');
      request.onsuccess = () => {
        TranslationStorage.db = request.result;
        resolve(TranslationStorage.db);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Ensure the store is created or reset if schema changes
        if (db.objectStoreNames.contains(TranslationStorage.STORE_NAME)) {
          db.deleteObjectStore(TranslationStorage.STORE_NAME);
        }

        db.createObjectStore(TranslationStorage.STORE_NAME, { keyPath: 'id' });
      };
    });
  }

  /**
   * Save bundle version into IndexedDB
   */
  public static async saveBundleVersion(version: number): Promise<void> {
    const db = await TranslationStorage.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TranslationStorage.STORE_NAME, 'readwrite');
      const store = tx.objectStore(TranslationStorage.STORE_NAME);
      store.put({ id: 'bundle_version', version });

      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject('Transaction failed while saving bundle version');
    });
  }

  /**
   * Get bundle version from IndexedDB
   */
  public static async getBundleVersion(): Promise<number> {
    const db = await TranslationStorage.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TranslationStorage.STORE_NAME, 'readonly');
      const store = tx.objectStore(TranslationStorage.STORE_NAME);
      const request = store.get('bundle_version');
      request.onsuccess = () => resolve(request.result?.version ?? 0);
      request.onerror = () => reject('Error reading IndexedDB');
    });
  }

  /**
   * Save translations to IndexedDB
   */
  public static async saveTranslations(
    namespace: string,
    lng: string,
    data: any
  ) {
    const db = await TranslationStorage.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TranslationStorage.STORE_NAME, 'readwrite');
      const store = tx.objectStore(TranslationStorage.STORE_NAME);
      store.put({
        id: `${namespace}_${lng}`,
        namespace,
        lng,
        data,
        timestamp: Date.now(),
      });

      tx.oncomplete = () => resolve({ ok: true });
      tx.onerror = () => reject('Transaction failed while saving translations');
    });
  }

  /**
   * Retrieve translations from IndexedDB
   */
  public static async getTranslations(
    namespace: string,
    lng: string
  ): Promise<any | null> {
    const db = await TranslationStorage.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(TranslationStorage.STORE_NAME, 'readonly');
      const store = tx.objectStore(TranslationStorage.STORE_NAME);
      const request = store.get(`${namespace}_${lng}`);
      request.onsuccess = () =>
        resolve(request.result ? request.result.data : null);
      request.onerror = () => reject('Error reading IndexedDB');
    });
  }
}

export default TranslationStorage;
