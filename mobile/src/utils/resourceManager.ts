import { performanceMonitor } from './performanceMonitor';
import { NativeEventEmitter, NativeModules } from 'react-native';

interface Resource {
  id: string;
  type: string;
  size: number;
  lastAccessed: number;
  cleanup: () => Promise<void>;
}

interface ResourceMetrics {
  totalSize: number;
  resourceCount: number;
  cleanupCount: number;
  lastCleanup: number;
}

class ResourceManager {
  private static instance: ResourceManager;
  private resources: Map<string, Resource> = new Map();
  private metrics: ResourceMetrics = {
    totalSize: 0,
    resourceCount: 0,
    cleanupCount: 0,
    lastCleanup: Date.now(),
  };
  private readonly maxSize: number = 50 * 1024 * 1024; // 50MB default
  private readonly cleanupThreshold: number = 0.8; // 80% of maxSize
  private readonly maxAge: number = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: NodeJS.Timeout | null = null;
  private eventEmitter: NativeEventEmitter;

  private constructor() {
    this.eventEmitter = new NativeEventEmitter(NativeModules.MemoryWarning);
    this.setupCleanupInterval();
    this.setupMemoryWarningListener();
  }

  public static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  /**
   * Register a new resource
   */
  public async registerResource(
    id: string,
    type: string,
    size: number,
    cleanup: () => Promise<void>
  ): Promise<void> {
    const resource: Resource = {
      id,
      type,
      size,
      lastAccessed: Date.now(),
      cleanup,
    };

    // Check if we need to cleanup before adding
    if (this.metrics.totalSize + size > this.maxSize * this.cleanupThreshold) {
      await this.cleanup();
    }

    this.resources.set(id, resource);
    this.metrics.totalSize += size;
    this.metrics.resourceCount++;

    performanceMonitor.recordMetric('resource_register', size, {
      type,
      totalSize: this.metrics.totalSize,
      resourceCount: this.metrics.resourceCount,
    });
  }

  /**
   * Access a resource (updates lastAccessed)
   */
  public accessResource(id: string): void {
    const resource = this.resources.get(id);
    if (resource) {
      resource.lastAccessed = Date.now();
      this.resources.set(id, resource);
    }
  }

  /**
   * Remove a resource
   */
  public async removeResource(id: string): Promise<void> {
    const resource = this.resources.get(id);
    if (resource) {
      await this.cleanupResource(resource);
      this.resources.delete(id);
      this.metrics.totalSize -= resource.size;
      this.metrics.resourceCount--;

      performanceMonitor.recordMetric('resource_remove', resource.size, {
        type: resource.type,
        totalSize: this.metrics.totalSize,
        resourceCount: this.metrics.resourceCount,
      });
    }
  }

  /**
   * Cleanup old resources
   */
  public async cleanup(): Promise<void> {
    const now = Date.now();
    const resourcesArray = Array.from(this.resources.values());
    const oldResources = resourcesArray.filter(
      (resource) => now - resource.lastAccessed > this.maxAge
    );

    if (oldResources.length > 0) {
      await Promise.all(
        oldResources.map((resource) => this.cleanupResource(resource))
      );

      this.metrics.cleanupCount += oldResources.length;
      this.metrics.lastCleanup = now;

      performanceMonitor.recordMetric('resource_cleanup', oldResources.length, {
        totalSize: this.metrics.totalSize,
        resourceCount: this.metrics.resourceCount,
        cleanupCount: this.metrics.cleanupCount,
      });
    }
  }

  /**
   * Force cleanup of all resources
   */
  public async cleanupAll(): Promise<void> {
    const resources = Array.from(this.resources.values());
    await Promise.all(resources.map((resource) => this.cleanupResource(resource)));

    this.resources.clear();
    this.metrics = {
      totalSize: 0,
      resourceCount: 0,
      cleanupCount: this.metrics.cleanupCount + resources.length,
      lastCleanup: Date.now(),
    };

    performanceMonitor.recordMetric('resource_cleanup_all', resources.length, {
      totalSize: 0,
      resourceCount: 0,
      cleanupCount: this.metrics.cleanupCount,
    });
  }

  /**
   * Get current metrics
   */
  public getMetrics(): ResourceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get resource info
   */
  public getResourceInfo(id: string): Omit<Resource, 'cleanup'> | null {
    const resource = this.resources.get(id);
    if (resource) {
      const { cleanup, ...info } = resource;
      return info;
    }
    return null;
  }

  /**
   * List all resources
   */
  public listResources(): Array<Omit<Resource, 'cleanup'>> {
    return Array.from(this.resources.values()).map(({ cleanup, ...info }) => info);
  }

  /**
   * Setup cleanup interval
   */
  private setupCleanupInterval(): void {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch((error) => {
        performanceMonitor.recordMetric('resource_cleanup_error', 1, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    }, 60 * 1000);
  }

  /**
   * Setup memory warning listener
   */
  private setupMemoryWarningListener(): void {
    this.eventEmitter.addListener('memoryWarning', async () => {
      try {
        await this.cleanup();
        performanceMonitor.recordMetric('memory_warning_cleanup', 1, {
          totalSize: this.metrics.totalSize,
          resourceCount: this.metrics.resourceCount,
        });
      } catch (error) {
        performanceMonitor.recordMetric('memory_warning_error', 1, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  }

  /**
   * Cleanup a single resource
   */
  private async cleanupResource(resource: Resource): Promise<void> {
    try {
      await resource.cleanup();
      performanceMonitor.recordMetric('resource_cleanup_success', 1, {
        type: resource.type,
        size: resource.size,
      });
    } catch (error) {
      performanceMonitor.recordMetric('resource_cleanup_error', 1, {
        type: resource.type,
        size: resource.size,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Cleanup on destroy
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.eventEmitter.removeAllListeners('memoryWarning');
    this.cleanupAll().catch((error) => {
      performanceMonitor.recordMetric('resource_destroy_error', 1, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
  }
}

// Export singleton instance
export const resourceManager = ResourceManager.getInstance();

// Helper hooks for common resource types
export const registerImageResource = async (
  id: string,
  size: number,
  cleanup: () => Promise<void>
): Promise<void> => {
  await resourceManager.registerResource(id, 'image', size, cleanup);
};

export const registerCacheResource = async (
  id: string,
  size: number,
  cleanup: () => Promise<void>
): Promise<void> => {
  await resourceManager.registerResource(id, 'cache', size, cleanup);
};

export const registerAnimationResource = async (
  id: string,
  size: number,
  cleanup: () => Promise<void>
): Promise<void> => {
  await resourceManager.registerResource(id, 'animation', size, cleanup);
};
