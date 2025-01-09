import { Platform } from 'react-native';
import { performanceMonitor } from './performanceMonitor';

export interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
}

export interface MemoryLeak {
  type: string;
  size: number;
  count: number;
  trace?: string[];
}

export interface MemoryProfile {
  snapshots: MemorySnapshot[];
  leaks: MemoryLeak[];
  timeline: {
    timestamp: number;
    event: string;
    memoryDelta: number;
  }[];
  summary: {
    averageUsage: number;
    peakUsage: number;
    leakScore: number;
    recommendations: string[];
  };
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

class MemoryProfiler {
  private isRecording: boolean = false;
  private snapshots: MemorySnapshot[] = [];
  private leaks: MemoryLeak[] = [];
  private timeline: MemoryProfile['timeline'] = [];
  private snapshotInterval: NodeJS.Timeout | null = null;
  private readonly SNAPSHOT_INTERVAL = 1000; // 1 second
  private readonly LEAK_THRESHOLD = 1024 * 1024; // 1MB
  private readonly GROWTH_THRESHOLD = 0.1; // 10% growth

  public startProfiling(): void {
    if (this.isRecording) return;

    this.isRecording = true;
    this.snapshots = [];
    this.leaks = [];
    this.timeline = [];

    this.takeSnapshot('Profile Start');
    this.startSnapshotInterval();

    performanceMonitor.recordMetric('memory_profiling_start', this.getCurrentMemoryUsage());
  }

  public stopProfiling(): MemoryProfile {
    if (!this.isRecording) {
      throw new Error('Profiling not started');
    }

    this.isRecording = false;
    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
      this.snapshotInterval = null;
    }

    this.takeSnapshot('Profile End');
    performanceMonitor.recordMetric('memory_profiling_end', this.getCurrentMemoryUsage());

    return this.generateProfile();
  }

  public takeSnapshot(event: string = ''): MemorySnapshot {
    const snapshot = this.createSnapshot();
    this.snapshots.push(snapshot);

    if (event) {
      const lastSnapshot = this.snapshots[this.snapshots.length - 2];
      const memoryDelta = lastSnapshot 
        ? snapshot.heapUsed - lastSnapshot.heapUsed 
        : 0;

      this.timeline.push({
        timestamp: snapshot.timestamp,
        event,
        memoryDelta,
      });
    }

    this.detectLeaks(snapshot);
    return snapshot;
  }

  private startSnapshotInterval(): void {
    this.snapshotInterval = setInterval(() => {
      this.takeSnapshot();
    }, this.SNAPSHOT_INTERVAL);
  }

  private createSnapshot(): MemorySnapshot {
    const memory = this.getMemoryInfo();
    return {
      timestamp: Date.now(),
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      arrayBuffers: memory.arrayBuffers,
    };
  }

  private getMemoryInfo(): {
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  } {
    // For React Native
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const perf = global?.performance as Performance | undefined;
      const memory = perf?.memory as MemoryInfo | undefined;
      if (memory) {
        return {
          heapUsed: memory.usedJSHeapSize,
          heapTotal: memory.totalJSHeapSize,
          external: 0,
          arrayBuffers: 0,
        };
      }
    }

    // For Node.js environment
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        arrayBuffers: usage.arrayBuffers || 0,
      };
    }

    // For web environment
    if (typeof globalThis !== 'undefined') {
      const perf = (globalThis as any).performance as Performance | undefined;
      const memory = perf?.memory as MemoryInfo | undefined;
      if (memory) {
        return {
          heapUsed: memory.usedJSHeapSize,
          heapTotal: memory.totalJSHeapSize,
          external: 0,
          arrayBuffers: 0,
        };
      }
    }

    // Default values if memory info is not available
    return {
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      arrayBuffers: 0,
    };
  }

  private getCurrentMemoryUsage(): number {
    return this.getMemoryInfo().heapUsed;
  }

  private detectLeaks(snapshot: MemorySnapshot): void {
    if (this.snapshots.length < 2) return;

    const previousSnapshot = this.snapshots[this.snapshots.length - 2];
    const growth = snapshot.heapUsed - previousSnapshot.heapUsed;
    const growthRate = growth / previousSnapshot.heapUsed;

    if (growth > this.LEAK_THRESHOLD && growthRate > this.GROWTH_THRESHOLD) {
      this.leaks.push({
        type: 'Heap Growth',
        size: growth,
        count: 1,
        trace: this.captureStackTrace(),
      });
    }
  }

  private captureStackTrace(): string[] {
    try {
      throw new Error('Stack trace');
    } catch (error) {
      return (error as Error).stack?.split('\n').slice(2) || [];
    }
  }

  private generateProfile(): MemoryProfile {
    const snapshots = [...this.snapshots];
    const usage = snapshots.map(s => s.heapUsed);
    const averageUsage = usage.reduce((a, b) => a + b, 0) / usage.length;
    const peakUsage = Math.max(...usage);
    const leakScore = this.calculateLeakScore();

    return {
      snapshots,
      leaks: this.leaks,
      timeline: this.timeline,
      summary: {
        averageUsage,
        peakUsage,
        leakScore,
        recommendations: this.generateRecommendations(averageUsage, peakUsage, leakScore),
      },
    };
  }

  private calculateLeakScore(): number {
    if (this.snapshots.length < 2) return 0;

    const initialUsage = this.snapshots[0].heapUsed;
    const finalUsage = this.snapshots[this.snapshots.length - 1].heapUsed;
    const duration = this.snapshots[this.snapshots.length - 1].timestamp - this.snapshots[0].timestamp;
    
    const growthRate = (finalUsage - initialUsage) / initialUsage;
    const timeWeight = Math.min(duration / (60 * 1000), 1); // Cap at 1 minute
    
    return growthRate * timeWeight * 100;
  }

  private generateRecommendations(
    averageUsage: number,
    peakUsage: number,
    leakScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (leakScore > 20) {
      recommendations.push('Significant memory growth detected. Consider implementing cleanup routines.');
    }

    if (peakUsage > averageUsage * 2) {
      recommendations.push('High memory spikes observed. Review memory-intensive operations.');
    }

    if (this.leaks.length > 0) {
      recommendations.push('Memory leaks detected. Check event listeners and cache cleanup.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Memory usage appears normal. Continue monitoring for changes.');
    }

    return recommendations;
  }

  public getSnapshot(index: number): MemorySnapshot | null {
    return this.snapshots[index] || null;
  }

  public getLeaks(): MemoryLeak[] {
    return [...this.leaks];
  }

  public getTimeline(): MemoryProfile['timeline'] {
    return [...this.timeline];
  }

  public clearData(): void {
    this.snapshots = [];
    this.timeline = [];
    this.leaks = [];
    performanceMonitor.recordMetric('memory_profiling_clear', 0);
  }
}

// Export singleton instance
export const memoryProfiler = new MemoryProfiler();
