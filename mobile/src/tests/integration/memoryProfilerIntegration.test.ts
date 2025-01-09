import { memoryProfiler } from '../../utils/memoryProfiler';
import { performanceMonitor } from '../../utils/performanceMonitor';

describe('Memory Profiler Integration', () => {
  beforeEach(() => {
    memoryProfiler.clearData();
    performanceMonitor.clearMetrics();
  });

  describe('Memory Profiling with Performance Monitoring', () => {
    it('should track memory usage during performance tests', async () => {
      // Start memory profiling
      memoryProfiler.startProfiling();

      // Simulate memory-intensive operations
      const largeArrays: number[][] = [];
      for (let i = 0; i < 5; i++) {
        // Record performance metric
        performanceMonitor.recordMetric('array_allocation', i);
        
        // Create large array
        largeArrays.push(new Array(1000000).fill(i));
        
        // Take memory snapshot
        memoryProfiler.takeSnapshot(`Allocation ${i}`);
        
        // Small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Clear arrays to simulate cleanup
      largeArrays.length = 0;
      memoryProfiler.takeSnapshot('Cleanup');

      // Stop profiling and analyze results
      const profile = memoryProfiler.stopProfiling();

      // Verify memory profile
      expect(profile.snapshots.length).toBeGreaterThan(5);
      expect(profile.timeline.some(t => t.event.includes('Allocation'))).toBe(true);
      expect(profile.timeline.some(t => t.event === 'Cleanup')).toBe(true);

      // Verify performance metrics
      const metrics = performanceMonitor.getMetrics('array_allocation');
      expect(metrics.length).toBe(5);

      // Verify memory statistics
      expect(profile.summary.averageUsage).toBeGreaterThan(0);
      expect(profile.summary.peakUsage).toBeGreaterThan(profile.summary.averageUsage);
      expect(profile.summary.recommendations.length).toBeGreaterThan(0);
    });

    it('should detect memory leaks in long-running operations', async () => {
      memoryProfiler.startProfiling();

      // Simulate a memory leak
      const leakedReferences: any[] = [];
      
      for (let i = 0; i < 3; i++) {
        performanceMonitor.recordMetric('operation_start', Date.now());
        
        // Create objects that won't be garbage collected
        leakedReferences.push({
          data: new Array(1000000).fill(Math.random()),
          timestamp: Date.now(),
          id: Math.random().toString()
        });

        memoryProfiler.takeSnapshot(`Operation ${i}`);
        performanceMonitor.recordMetric('operation_end', Date.now());
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const profile = memoryProfiler.stopProfiling();

      // Verify leak detection
      expect(profile.leaks.length).toBeGreaterThan(0);
      expect(profile.summary.leakScore).toBeGreaterThan(0);
      expect(profile.summary.recommendations.some(r => r.includes('leak'))).toBe(true);

      // Verify performance correlation
      const startMetrics = performanceMonitor.getMetrics('operation_start');
      const endMetrics = performanceMonitor.getMetrics('operation_end');
      expect(startMetrics.length).toBe(endMetrics.length);

      // Cleanup
      leakedReferences.length = 0;
    });

    it('should handle rapid memory fluctuations', async () => {
      memoryProfiler.startProfiling();

      const temporaryArrays: number[][] = [];
      
      // Simulate rapid allocations and deallocations
      for (let i = 0; i < 10; i++) {
        performanceMonitor.recordMetric('memory_operation', i);

        // Allocate
        temporaryArrays.push(new Array(500000).fill(i));
        memoryProfiler.takeSnapshot(`Allocation ${i}`);

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 50));

        // Deallocate
        temporaryArrays.pop();
        memoryProfiler.takeSnapshot(`Deallocation ${i}`);

        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const profile = memoryProfiler.stopProfiling();

      // Verify memory pattern
      const allocations = profile.timeline.filter(t => t.event.includes('Allocation'));
      const deallocations = profile.timeline.filter(t => t.event.includes('Deallocation'));

      expect(allocations.length).toBe(10);
      expect(deallocations.length).toBe(10);

      // Verify memory returns close to initial state
      const initialUsage = profile.snapshots[0].heapUsed;
      const finalUsage = profile.snapshots[profile.snapshots.length - 1].heapUsed;
      expect(Math.abs(finalUsage - initialUsage) / initialUsage).toBeLessThan(0.1); // Within 10%

      // Verify performance metrics
      const metrics = performanceMonitor.getMetrics('memory_operation');
      expect(metrics.length).toBe(10);
    });

    it('should correlate performance metrics with memory usage', async () => {
      memoryProfiler.startProfiling();

      // Track performance and memory simultaneously
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        performanceMonitor.recordMetric('operation_duration', 0);

        // Simulate varying workloads
        const workload = new Array(100000 * (i + 1)).fill(0);
        memoryProfiler.takeSnapshot(`Workload ${i}`);

        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric('operation_duration', duration);

        // Cleanup
        workload.length = 0;
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const profile = memoryProfiler.stopProfiling();
      const durations = performanceMonitor.getMetrics('operation_duration');

      // Verify correlation between memory and performance
      expect(profile.snapshots.length).toBe(durations.length / 2 + 2); // +2 for start/end snapshots
      expect(profile.summary.recommendations.length).toBeGreaterThan(0);
    });
  });
});
