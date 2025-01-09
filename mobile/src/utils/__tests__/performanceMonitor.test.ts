import { performanceMonitor } from '../performanceMonitor';

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics();
  });

  describe('Basic Metrics', () => {
    it('should record and retrieve metrics', () => {
      performanceMonitor.recordMetric('test', 100);
      const metrics = performanceMonitor.getMetrics('test');
      expect(metrics).toHaveLength(1);
      expect(metrics[0].value).toBe(100);
    });

    it('should handle multiple metrics', () => {
      performanceMonitor.recordMetric('test1', 100);
      performanceMonitor.recordMetric('test2', 200);
      expect(performanceMonitor.getMetrics('test1')).toHaveLength(1);
      expect(performanceMonitor.getMetrics('test2')).toHaveLength(1);
    });

    it('should clear metrics', () => {
      performanceMonitor.recordMetric('test', 100);
      performanceMonitor.clearMetrics();
      expect(performanceMonitor.getMetrics('test')).toHaveLength(0);
    });
  });

  describe('Statistics', () => {
    it('should calculate statistics for metrics', () => {
      performanceMonitor.recordMetric('test', 100);
      performanceMonitor.recordMetric('test', 200);
      performanceMonitor.recordMetric('test', 300);

      const stats = performanceMonitor.getStatistics('test');
      expect(stats.min).toBe(100);
      expect(stats.max).toBe(300);
      expect(stats.average).toBe(200);
      expect(stats.count).toBe(3);
      expect(stats.standardDeviation).toBeGreaterThan(0);
    });

    it('should handle empty metrics', () => {
      const stats = performanceMonitor.getStatistics('nonexistent');
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.count).toBe(0);
      expect(stats.standardDeviation).toBe(0);
    });
  });

  describe('Thresholds', () => {
    it('should handle thresholds', () => {
      const threshold = {
        name: 'test',
        warning: 100,
        critical: 200
      };

      performanceMonitor.setThreshold('test', threshold);
      
      const listener = jest.fn();
      performanceMonitor.addListener('test_warning', listener);
      performanceMonitor.addListener('test_critical', listener);

      performanceMonitor.recordMetric('test', 150);
      expect(listener).toHaveBeenCalledTimes(1);

      performanceMonitor.recordMetric('test', 250);
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should remove listeners', () => {
      const listener = jest.fn();
      performanceMonitor.addListener('test', listener);
      performanceMonitor.removeListener('test', listener);
      performanceMonitor.recordMetric('test', 100);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('Monitoring', () => {
    it('should start and stop monitoring', () => {
      performanceMonitor.startMonitoring();
      expect(performanceMonitor['isMonitoring']).toBe(true);
      performanceMonitor.stopMonitoring();
      expect(performanceMonitor['isMonitoring']).toBe(false);
    });

    it('should handle multiple start/stop cycles', () => {
      performanceMonitor.startMonitoring();
      performanceMonitor.startMonitoring(); // Should not throw
      performanceMonitor.stopMonitoring();
      performanceMonitor.stopMonitoring(); // Should not throw
    });
  });

  describe('Time-based Metrics', () => {
    it('should handle time ranges', () => {
      const now = Date.now();
      performanceMonitor.recordMetric('test', 100);
      
      // Simulate time passing
      jest.spyOn(Date, 'now').mockImplementation(() => now + 1000);
      performanceMonitor.recordMetric('test', 200);

      const metrics = performanceMonitor.getMetricRange('test', now, now + 2000);
      expect(metrics).toHaveLength(2);
    });

    it('should calculate average over time', () => {
      const now = Date.now();
      performanceMonitor.recordMetric('test', 100);
      
      // Simulate time passing
      jest.spyOn(Date, 'now').mockImplementation(() => now + 1000);
      performanceMonitor.recordMetric('test', 200);

      const average = performanceMonitor.getAverageMetric('test', 2000);
      expect(average).toBe(150);
    });
  });
});
