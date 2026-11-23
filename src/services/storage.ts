/**
 * Storage Service (§3 Architecture & Storage)
 * - Single wrapper with in-memory cache and write-through
 * - AES-GCM envelope simulation for "encrypted at rest"
 * - Falls back to memory cache if localStorage is unavailable or throws
 * - Entity-based repositories for future backend portability
 */

import { encryptEnvelope, decryptEnvelope } from "./crypto";

type StorageListener = (key: string) => void;

class StorageServiceClass {
  private memCache = new Map<string, any>();
  private listeners = new Set<StorageListener>();
  private isLocalStorageAvailable = true;
  private storageListenerAttached = false;
  private readonly PREFIX = "pts_store_";

  constructor() {
    this.checkLocalStorage();
  }

  private checkLocalStorage(): void {
    if (typeof window === "undefined" || !window.localStorage) {
      this.isLocalStorageAvailable = false;
      return;
    }
    try {
      const testKey = "__pts_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      this.isLocalStorageAvailable = true;
    } catch {
      this.isLocalStorageAvailable = false;
    }
  }

  /**
   * Save item to storage with simulated encryption envelope and write-through cache
   */
  public async setItem<T>(key: string, value: T): Promise<void> {
    const prefixedKey = this.PREFIX + key;
    this.memCache.set(prefixedKey, value);
    this.emit(key);

    if (this.isLocalStorageAvailable) {
      try {
        const envelope = await encryptEnvelope(value);
        window.localStorage.setItem(prefixedKey, envelope);
      } catch (err) {
        console.warn(`LocalStorage write failed for ${key}, falling back to memory:`, err);
        this.isLocalStorageAvailable = false;
      }
    }
  }

  /**
   * Retrieve item from cache or decrypted storage
   */
  public async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    const prefixedKey = this.PREFIX + key;

    // Check memory cache first
    if (this.memCache.has(prefixedKey)) {
      return this.memCache.get(prefixedKey) as T;
    }

    if (this.isLocalStorageAvailable) {
      try {
        const stored = window.localStorage.getItem(prefixedKey);
        if (stored) {
          const decrypted = await decryptEnvelope(stored);
          if (decrypted !== null && decrypted !== undefined) {
            this.memCache.set(prefixedKey, decrypted);
            return decrypted as T;
          }
        }
      } catch (err) {
        console.warn(`LocalStorage read failed for ${key}:`, err);
      }
    }

    if (defaultValue !== undefined) {
      await this.setItem(key, defaultValue);
      return defaultValue;
    }

    return null;
  }

  /**
   * Synchronous get from memory cache (for immediate UI sync when needed)
   */
  public getMemItem<T>(key: string): T | null {
    const prefixedKey = this.PREFIX + key;
    return this.memCache.has(prefixedKey) ? (this.memCache.get(prefixedKey) as T) : null;
  }

  /**
   * Notify listeners after a directory write so session identity and permissions stay live.
   */
  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    this.attachStorageListener();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private attachStorageListener(): void {
    if (this.storageListenerAttached || typeof window === "undefined") return;
    window.addEventListener("storage", (event) => {
      const storageKey = event.key;
      if (!storageKey?.startsWith(this.PREFIX)) return;
      const key = storageKey.slice(this.PREFIX.length);

      if (event.newValue === null) {
        this.memCache.delete(storageKey);
        this.emit(key);
        return;
      }

      void decryptEnvelope(event.newValue)
        .then((value) => {
          if (value === null || value === undefined) {
            this.memCache.delete(storageKey);
          } else {
            this.memCache.set(storageKey, value);
          }
          this.emit(key);
        })
        .catch((err) => {
          console.warn(`LocalStorage sync failed for ${key}:`, err);
        });
    });
    this.storageListenerAttached = true;
  }

  private emit(key: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(key);
      } catch (err) {
        console.warn(`Storage listener failed for ${key}:`, err);
      }
    });
  }

  /**
   * Remove item from memory and local storage
   */
  public async removeItem(key: string): Promise<void> {
    const prefixedKey = this.PREFIX + key;
    this.memCache.delete(prefixedKey);
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(prefixedKey);
      } catch {
        // ignore
      }
    }
  }

  /**
   * Clear all PTS keys
   */
  public async clearAll(): Promise<void> {
    this.memCache.clear();
    if (this.isLocalStorageAvailable) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(this.PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      } catch {
        // ignore
      }
    }
  }
}

export const Storage = new StorageServiceClass();

/**
 * Generic Entity Repository
 */
export class EntityRepository<T extends { id: string }> {
  constructor(private entityKey: string) {}

  public async getAll(): Promise<T[]> {
    const items = await Storage.getItem<T[]>(this.entityKey, []);
    return items || [];
  }

  public async getById(id: string): Promise<T | null> {
    const all = await this.getAll();
    return all.find((item) => item.id === id) || null;
  }

  public async saveAll(items: T[]): Promise<void> {
    await Storage.setItem(this.entityKey, items);
  }

  public async add(item: T): Promise<void> {
    const all = await this.getAll();
    all.push(item);
    await this.saveAll(all);
  }

  public async update(id: string, updates: Partial<T>): Promise<T | null> {
    const all = await this.getAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...updates };
    await this.saveAll(all);
    return all[index];
  }

  public async remove(id: string): Promise<boolean> {
    const all = await this.getAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length === all.length) return false;
    await this.saveAll(filtered);
    return true;
  }
}

