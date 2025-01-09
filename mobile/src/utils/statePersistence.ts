import AsyncStorage from '@react-native-async-storage/async-storage';
import { performanceMonitor } from './performanceMonitor';

interface PersistConfig {
  key: string;
  version: number;
  whitelist?: string[];
  blacklist?: string[];
  transforms?: StateTransform[];
  throttle?: number;
  serialize?: boolean;
}

interface StateTransform {
  in: (state: any, key: string) => any;
  out: (state: any, key: string) => any;
}

interface PersistenceMetrics {
  lastSave: number;
  saveCount: number;
  loadCount: number;
  errorCount: number;
  averageSaveTime: number;
}

class StatePersistence {
  private static instance: StatePersistence;
  private config: PersistConfig;
  private metrics: PersistenceMetrics;
  private saveTimeout: NodeJS.Timeout | null = null;
  private lastSavePromise: Promise<void> | null = null;

  private constructor(config: PersistConfig) {
    this.config = {
      throttle: 1000, // Default 1 second throttle
      serialize: true,
      ...config,
    };
    this.metrics = {
      lastSave: 0,
      saveCount: 0,
      loadCount: 0,
      errorCount: 0,
      averageSaveTime: 0,
    };
  }

  public static getInstance(config?: PersistConfig): StatePersistence {
    if (!StatePersistence.instance && config) {
      StatePersistence.instance = new StatePersistence(config);
    }
    return StatePersistence.instance;
  }

  /**
   * Save state to persistent storage
   */
  public async saveState(state: any): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Wait for any pending save to complete
    if (this.lastSavePromise) {
      await this.lastSavePromise;
    }

    this.lastSavePromise = new Promise<void>((resolve) => {
      this.saveTimeout = setTimeout(async () => {
        const startTime = Date.now();
        try {
          const processedState = this.processState(state, 'out');
          const stateToSave = this.config.serialize
            ? JSON.stringify(processedState)
            : processedState;

          await AsyncStorage.setItem(
            `${this.config.key}_v${this.config.version}`,
            stateToSave
          );

          const duration = Date.now() - startTime;
          this.updateMetrics('save', duration);

          performanceMonitor.recordMetric('state_persistence_save', duration, {
            size: JSON.stringify(processedState).length,
          });
        } catch (error) {
          this.handleError('save', error);
        }
        resolve();
      }, this.config.throttle);
    });

    await this.lastSavePromise;
  }

  /**
   * Load state from persistent storage
   */
  public async loadState<T>(): Promise<T | null> {
    const startTime = Date.now();
    try {
      const serializedState = await AsyncStorage.getItem(
        `${this.config.key}_v${this.config.version}`
      );

      if (!serializedState) {
        return null;
      }

      const state = this.config.serialize
        ? JSON.parse(serializedState)
        : serializedState;
      const processedState = this.processState(state, 'in');

      const duration = Date.now() - startTime;
      this.updateMetrics('load', duration);

      performanceMonitor.recordMetric('state_persistence_load', duration, {
        size: serializedState.length,
      });

      return processedState;
    } catch (error) {
      this.handleError('load', error);
      return null;
    }
  }

  /**
   * Clear persisted state
   */
  public async clearState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(
        `${this.config.key}_v${this.config.version}`
      );
      performanceMonitor.recordMetric('state_persistence_clear', 1);
    } catch (error) {
      this.handleError('clear', error);
    }
  }

  /**
   * Process state through transforms
   */
  private processState(state: any, direction: 'in' | 'out'): any {
    if (!this.config.transforms) {
      return state;
    }

    return this.config.transforms.reduce((processedState, transform) => {
      const keys = Object.keys(processedState);
      const filteredKeys = this.filterKeys(keys);

      return filteredKeys.reduce(
        (result, key) => ({
          ...result,
          [key]: transform[direction](processedState[key], key),
        }),
        {}
      );
    }, state);
  }

  /**
   * Filter keys based on whitelist/blacklist
   */
  private filterKeys(keys: string[]): string[] {
    if (this.config.whitelist) {
      return keys.filter((key) => this.config.whitelist!.includes(key));
    }
    if (this.config.blacklist) {
      return keys.filter((key) => !this.config.blacklist!.includes(key));
    }
    return keys;
  }

  /**
   * Update persistence metrics
   */
  private updateMetrics(operation: 'save' | 'load', duration: number): void {
    if (operation === 'save') {
      this.metrics.saveCount++;
      this.metrics.lastSave = Date.now();
      this.metrics.averageSaveTime =
        (this.metrics.averageSaveTime * (this.metrics.saveCount - 1) +
          duration) /
        this.metrics.saveCount;
    } else {
      this.metrics.loadCount++;
    }
  }

  /**
   * Handle persistence errors
   */
  private handleError(operation: string, error: any): void {
    this.metrics.errorCount++;
    performanceMonitor.recordMetric('state_persistence_error', 1, {
      operation,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    console.error(`State persistence ${operation} error:`, error);
  }

  /**
   * Get persistence metrics
   */
  public getMetrics(): PersistenceMetrics {
    return { ...this.metrics };
  }

  /**
   * Create a transform
   */
  public static createTransform(
    inbound: (state: any, key: string) => any,
    outbound: (state: any, key: string) => any
  ): StateTransform {
    return {
      in: inbound,
      out: outbound,
    };
  }
}

// Export singleton instance creator
export const createStatePersistence = (config: PersistConfig) =>
  StatePersistence.getInstance(config);

// Export transform creator
export const createTransform = StatePersistence.createTransform;

// Example transforms
export const compressTransform = createTransform(
  // Decompress on load
  (state) => {
    if (typeof state === 'string') {
      try {
        return JSON.parse(state);
      } catch {
        return state;
      }
    }
    return state;
  },
  // Compress on save
  (state) => {
    if (typeof state === 'object') {
      return JSON.stringify(state);
    }
    return state;
  }
);

export const encryptTransform = (secretKey: string) =>
  createTransform(
    // Decrypt on load
    (state) => {
      if (typeof state === 'string') {
        // Implement decryption here
        return state;
      }
      return state;
    },
    // Encrypt on save
    (state) => {
      if (typeof state === 'object') {
        // Implement encryption here
        return state;
      }
      return state;
    }
  );
