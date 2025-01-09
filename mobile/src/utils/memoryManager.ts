import { InteractionManager, Platform } from 'react-native';
import { useEffect } from 'react';
import { cleanImageCache } from './imageLoader';

interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  timestamp: number;
}

const MEMORY_THRESHOLD = 0.8; // 80% memory usage threshold
const CLEANUP_INTERVAL = 60000; // 1 minute
const MEMORY_HISTORY_SIZE = 10;

class MemoryManager {
  private static instance: MemoryManager;
  private memoryHistory: MemoryStats[] = [];
  private cleanupTimer: NodeJS.Timeout | null = null;
  private isPerformingCleanup = false;

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Start monitoring memory usage
   */
  private startMonitoring(): void {
    this.cleanupTimer = setInterval(() => {
      this.checkMemoryUsage();
    }, CLEANUP_INTERVAL);
  }

  /**
   * Stop monitoring memory usage
   */
  public stopMonitoring(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Check current memory usage and perform cleanup if needed
   */
  private async checkMemoryUsage(): Promise<void> {
    if (this.isPerformingCleanup) return;

    const stats = await this.getMemoryStats();
    this.memoryHistory.push(stats);

    if (this.memoryHistory.length > MEMORY_HISTORY_SIZE) {
      this.memoryHistory.shift();
    }

    const memoryUsage = stats.heapUsed / stats.heapTotal;
    if (memoryUsage > MEMORY_THRESHOLD) {
      this.performCleanup();
    }
  }

  /**
   * Get current memory statistics
   */
  private async getMemoryStats(): Promise<MemoryStats> {
    // Use global.performance for web
    if (Platform.OS === 'web' && global.performance) {
      const memory = (performance as any).memory;
      return {
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        timestamp: Date.now(),
      };
    }

    // For native platforms, use process.memoryUsage()
    const { heapUsed, heapTotal } = process.memoryUsage();
    return {
      heapUsed,
      heapTotal,
      timestamp: Date.now(),
    };
  }

  /**
   * Perform memory cleanup tasks
   */
  private async performCleanup(): Promise<void> {
    this.isPerformingCleanup = true;

    try {
      // Schedule cleanup for when the app is idle
      await InteractionManager.runAfterInteractions(async () => {
        // Clear image cache
        cleanImageCache();

        // Clear memory history
        this.memoryHistory = [];

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      });
    } finally {
      this.isPerformingCleanup = false;
    }
  }

  /**
   * Get memory usage trend
   */
  public getMemoryTrend(): {
    trend: 'increasing' | 'decreasing' | 'stable';
    averageUsage: number;
  } {
    if (this.memoryHistory.length < 2) {
      return { trend: 'stable', averageUsage: 0 };
    }

    const usages = this.memoryHistory.map(
      (stats) => stats.heapUsed / stats.heapTotal
    );
    const averageUsage =
      usages.reduce((sum, usage) => sum + usage, 0) / usages.length;

    const firstHalf = usages.slice(0, Math.floor(usages.length / 2));
    const secondHalf = usages.slice(Math.floor(usages.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, usage) => sum + usage, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, usage) => sum + usage, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;
    const trend =
      Math.abs(difference) < 0.05
        ? 'stable'
        : difference > 0
        ? 'increasing'
        : 'decreasing';

    return { trend, averageUsage };
  }

  /**
   * Manually trigger cleanup
   */
  public async forceCleanup(): Promise<void> {
    if (!this.isPerformingCleanup) {
      await this.performCleanup();
    }
  }

  /**
   * Register cleanup callback for component unmount
   */
  public registerCleanupCallback(callback: () => void): () => void {
    return () => {
      InteractionManager.runAfterInteractions(() => {
        callback();
      });
    };
  }
}

// Export singleton instance
export const memoryManager = MemoryManager.getInstance();

// Export hook for components
export const useMemoryCleanup = (cleanup: () => void): void => {
  useEffect(() => {
    return memoryManager.registerCleanupCallback(cleanup);
  }, [cleanup]);
};
