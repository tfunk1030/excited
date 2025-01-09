import { memoryProfiler, MemorySnapshot } from '../memoryProfiler';
import { performanceMonitor } from '../performanceMonitor';

jest.mock('../performanceMonitor');

describe('MemoryProfiler', () => {
  beforeEach(() => {
    memoryProfiler.clearData();
    jest.clearAllMocks();
  });

  describe('Basic Profiling', () => {
    it('should start and stop profiling', () => {
      memoryProfiler.startProfiling();
      const profile = memoryProfiler.stopProfiling();
      
      expect(profile.snapshots.length).toBeGreaterThan(0);
      expect(profile.timeline[0].event).toBe('Profile Start');
      expect(profile.timeline[profile.timeline.length - 1].event).toBe('Profile End');
    });

    it('should prevent multiple profiling sessions', () => {
      memoryProfiler.startProfiling();
      expect(() => memoryProfiler.startProfiling()).not.toThrow();
      memoryProfiler.stopProfiling();
    });

    it('should throw when stopping without starting', () => {
      expect(() => memoryProfiler.stopProfiling()).toThrow('Profiling not started');
    });
  });

  describe('Memory Snapshots', () => {
    it('should take snapshots with events', () => {
      memoryProfiler.startProfiling();
      const snapshot = memoryProfiler.takeSnapshot('Test Event');
      
      expect(snapshot.timestamp).toBeDefined();
      expect(snapshot.heapUsed).toBeGreaterThanOrEqual(0);
      expect(memoryProfiler.getTimeline()[1].event).toBe('Test Event');
      
      memoryProfiler.stopProfiling();
    });

    it('should calculate memory deltas', () => {
      memoryProfiler.startProfiling();
      
      // Take multiple snapshots
      memoryProfiler.takeSnapshot('Event 1');
      memoryProfiler.takeSnapshot('Event 2');
      
      const profile = memoryProfiler.stopProfiling();
      const timeline = profile.timeline;
      
      expect(timeline.length).toBeGreaterThan(2);
      expect(timeline[1].memoryDelta).toBeDefined();
      expect(timeline[2].memoryDelta).toBeDefined();
    });
  });

  describe('Leak Detection', () => {
    it('should detect memory leaks', () => {
      memoryProfiler.startProfiling();
      
      // Simulate memory growth
      const largeArray = new Array(1000000).fill(0);
      memoryProfiler.takeSnapshot('After Allocation');
      
      const profile = memoryProfiler.stopProfiling();
      expect(profile.leaks.length).toBeGreaterThan(0);
      expect(profile.summary.leakScore).toBeGreaterThan(0);
      
      // Cleanup
      largeArray.length = 0;
    });

    it('should provide stack traces for leaks', () => {
      memoryProfiler.startProfiling();
      
      // Simulate memory leak
      const leak = new Array(1000000).fill(0);
      memoryProfiler.takeSnapshot('Leak Event');
      
      const profile = memoryProfiler.stopProfiling();
      const hasLeak = profile.leaks.some(l => l.trace && l.trace.length > 0);
      expect(hasLeak).toBe(true);
      
      // Cleanup
      leak.length = 0;
    });
  });

  describe('Profile Analysis', () => {
    it('should calculate memory statistics', () => {
      memoryProfiler.startProfiling();
      
      // Create varying memory usage
      let arrays: number[][] = [];
      for (let i = 0; i < 3; i++) {
        arrays.push(new Array(100000).fill(i));
        memoryProfiler.takeSnapshot(`Allocation ${i}`);
      }
      
      const profile = memoryProfiler.stopProfiling();
      expect(profile.summary.averageUsage).toBeGreaterThan(0);
      expect(profile.summary.peakUsage).toBeGreaterThan(profile.summary.averageUsage);
      
      // Cleanup
      arrays = [];
    });

    it('should generate recommendations', () => {
      memoryProfiler.startProfiling();
      
      // Simulate memory issues
      const leak = new Array(1000000).fill(0);
      memoryProfiler.takeSnapshot('Memory Issue');
      
      const profile = memoryProfiler.stopProfiling();
      expect(profile.summary.recommendations.length).toBeGreaterThan(0);
      expect(profile.summary.recommendations[0]).toMatch(/memory|leak|usage/i);
      
      // Cleanup
      leak.length = 0;
    });
  });

  describe('Performance Monitoring', () => {
    it('should record metrics with performanceMonitor', () => {
      memoryProfiler.startProfiling();
      
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'memory_profiling_start',
        expect.any(Number)
      );
      
      memoryProfiler.stopProfiling();
      
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'memory_profiling_end',
        expect.any(Number)
      );
    });

    it('should record clear metrics', () => {
      memoryProfiler.clearData();
      
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'memory_profiling_clear',
        0
      );
    });
  });

  describe('Data Management', () => {
    it('should clear profiling data', () => {
      memoryProfiler.startProfiling();
      memoryProfiler.takeSnapshot('Test');
      memoryProfiler.stopProfiling();
      
      memoryProfiler.clearData();
      expect(memoryProfiler.getSnapshot(0)).toBeNull();
      expect(memoryProfiler.getLeaks()).toHaveLength(0);
      expect(memoryProfiler.getTimeline()).toHaveLength(0);
    });

    it('should handle rapid start/stop cycles', () => {
      for (let i = 0; i < 5; i++) {
        memoryProfiler.startProfiling();
        memoryProfiler.takeSnapshot(`Cycle ${i}`);
        const profile = memoryProfiler.stopProfiling();
        expect(profile.snapshots.length).toBeGreaterThan(0);
      }
    });
  });
});
