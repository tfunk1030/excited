interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastCleanup: Date | null;
  memoryEntries: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

export class NetworkCache {
  private cache: Map<string, any> = new Map();
  private timestamps: Map<string, number> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    lastCleanup: null,
    memoryEntries: 0,
    oldestEntry: null,
    newestEntry: null,
  };

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const now = Date.now();
    this.cache.set(key, value);
    this.timestamps.set(key, now + (ttl || 0));
    this.stats.size = this.cache.size;
    this.stats.memoryEntries = this.cache.size;
    
    // Update entry timestamps
    if (this.cache.size === 1) {
      this.stats.oldestEntry = new Date(now);
    }
    this.stats.newestEntry = new Date(now);
  }

  async get(key: string): Promise<any> {
    const value = this.cache.get(key);
    const timestamp = this.timestamps.get(key);

    if (value === undefined || (timestamp && timestamp < Date.now())) {
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return value;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.timestamps.clear();
    this.stats.size = 0;
    this.stats.memoryEntries = 0;
    this.stats.lastCleanup = new Date();
    this.stats.oldestEntry = null;
    this.stats.newestEntry = null;
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
    this.timestamps.delete(key);
    this.stats.size = this.cache.size;
    this.stats.memoryEntries = this.cache.size;
    
    // Update entry timestamps if cache is empty
    if (this.cache.size === 0) {
      this.stats.oldestEntry = null;
      this.stats.newestEntry = null;
    }
  }

  async remove(key: string): Promise<void> {
    await this.invalidate(key);
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  withCache<T>(
    key: string,
    fn: () => Promise<T>,
    options: number | CacheOptions = {}
  ): Promise<T> {
    // Convert number to options object (for backward compatibility)
    const normalizedOptions: CacheOptions = typeof options === 'number' 
      ? { ttl: options }
      : options;

    return new Promise(async (resolve, reject) => {
      try {
        // Check cache first
        const cached = await this.get(key);
        if (cached !== null) {
          resolve(cached);
          return;
        }

        // Execute function
        const result = await fn();

        // Cache result
        await this.set(key, result, normalizedOptions.ttl);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Allow direct access for testing
  [key: string]: any;
}

// Decorator factory
export function withNetworkCache(key: string, options: number | CacheOptions = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return networkCache.withCache(
        `${key}_${JSON.stringify(args)}`,
        () => originalMethod.apply(this, args),
        options
      );
    };

    return descriptor;
  };
}

export const networkCache = new NetworkCache();
