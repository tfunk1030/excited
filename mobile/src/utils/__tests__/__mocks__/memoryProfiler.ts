import { MemorySnapshot, MemoryLeak, MemoryProfile } from '../../memoryProfiler';
import { performanceMonitor } from '../../../utils/performanceMonitor';

class MockMemoryProfiler {
  private isRecording: boolean = false;
  private snapshots: MemorySnapshot[] = [];
  private leaks: MemoryLeak[] = [];
  private timeline: MemoryProfile['timeline'] = [];
  private mockHeapUsage: number = 0;

  public startProfiling = jest.fn(() => {
    if (this.isRecording) return;

    this.isRecording = true;
    this.snapshots = [];
    this.leaks = [];
    this.timeline = [];
    this.mockHeapUsage = 1000000; // 1MB initial heap

    this.takeSnapshot('Profile Start');
    performanceMonitor.recordMetric('memory_profiling_start', this.mockHeapUsage);
  });

  public stopProfiling = jest.fn(() => {
    if (!this.isRecording) {
      throw new Error('Profiling not started');
    }

    this.isRecording = false;
    this.takeSnapshot('Profile End');
    performanceMonitor.recordMetric('memory_profiling_end', this.mockHeapUsage);

    return this.generateProfile();
  });

  public takeSnapshot = jest.fn((event: string = ''): MemorySnapshot => {
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: this.mockHeapUsage,
      heapTotal: this.mockHeapUsage * 1.5,
      external: 0,
      arrayBuffers: 0,
    };

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

    // Simulate memory growth for next snapshot
    this.mockHeapUsage += Math.random() * 500000; // Random growth up to 500KB

    return snapshot;
  });

  public getSnapshot = jest.fn((index: number): MemorySnapshot | null => {
    return this.snapshots[index] || null;
  });

  public getLeaks = jest.fn((): MemoryLeak[] => {
    return [...this.leaks];
  });

  public getTimeline = jest.fn(() => {
    return [...this.timeline];
  });

  public clearData = jest.fn(() => {
    this.snapshots = [];
    this.timeline = [];
    this.leaks = [];
    this.mockHeapUsage = 0;
    performanceMonitor.recordMetric('memory_profiling_clear', 0);
  });

  private generateProfile(): MemoryProfile {
    const snapshots = [...this.snapshots];
    const usage = snapshots.map(s => s.heapUsed);
    const averageUsage = usage.reduce((a, b) => a + b, 0) / usage.length;
    const peakUsage = Math.max(...usage);
    const leakScore = this.calculateLeakScore();

    // Simulate leak detection
    if (peakUsage > averageUsage * 1.5) {
      this.leaks.push({
        type: 'Heap Growth',
        size: peakUsage - averageUsage,
        count: 1,
        trace: ['Mock stack trace line 1', 'Mock stack trace line 2'],
      });
    }

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
    const timeWeight = Math.min(duration / (60 * 1000), 1);
    
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
}

export const memoryProfiler = new MockMemoryProfiler();
