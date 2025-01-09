import { performanceMonitor } from '../../utils/performanceMonitor';
import { loadTester } from '../../utils/loadTester';
import { stressTester } from '../../utils/stressTester';

describe('Performance Tools Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    performanceMonitor.clearMetrics();
  });

  afterEach(() => {
    jest.useRealTimers();
    performanceMonitor.stopMonitoring();
    loadTester.stop();
    stressTester.stop();
  });

  describe('Load Testing with Performance Monitoring', () => {
    it('should record performance metrics during load test', async () => {
      // Start performance monitoring
      performanceMonitor.startMonitoring(100); // 100ms interval

      // Create a mock API request that takes variable time
      const mockRequest = jest.fn().mockImplementation(() => {
        return new Promise(resolve => {
          const responseTime = Math.random() * 100; // 0-100ms
          setTimeout(resolve, responseTime);
        });
      });

      // Run a short load test
      const loadTestPromise = loadTester.runTest(mockRequest);

      // Advance time to complete the test
      jest.advanceTimersByTime(1000);

      const loadTestResult = await loadTestPromise;

      // Get performance metrics
      const responseTimeMetrics = performanceMonitor.getMetrics('load_test_response_time');
      const fpsMetrics = performanceMonitor.getMetrics('fps');

      // Verify metrics were recorded
      expect(responseTimeMetrics.length).toBeGreaterThan(0);
      expect(fpsMetrics.length).toBeGreaterThan(0);

      // Verify load test results match performance metrics
      expect(loadTestResult.averageResponseTime).toBeCloseTo(
        performanceMonitor.getStats('load_test_response_time').stats.avg,
        1
      );
    });
  });

  describe('Stress Testing with Performance Monitoring', () => {
    it('should track system metrics during stress test', async () => {
      // Start performance monitoring
      performanceMonitor.startMonitoring(100);

      // Mock request with increasing failure rate at higher loads
      const mockRequest = jest.fn().mockImplementation(() => {
        const currentLevel = stressTester.getResults()[0]?.rps || 0;
        const failureRate = Math.max(0, (currentLevel - 50) / 100); // Start failing above 50 RPS
        
        return new Promise((resolve, reject) => {
          const shouldFail = Math.random() < failureRate;
          if (shouldFail) {
            reject(new Error('System overload'));
          } else {
            const responseTime = Math.random() * 100 * (1 + currentLevel / 50); // Response time increases with load
            setTimeout(resolve, responseTime);
          }
        });
      });

      // Run a stress test
      const stressTestPromise = stressTester.runTest(mockRequest);

      // Advance through each stress level
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(1200); // 1000ms test + 100ms stabilization + 100ms cooldown
      }

      const stressTestResult = await stressTestPromise;

      // Verify system metrics were tracked
      const cpuMetrics = performanceMonitor.getMetrics('system_resources');
      const memoryMetrics = performanceMonitor.getMetrics('memory_usage');

      expect(cpuMetrics.length).toBeGreaterThan(0);
      expect(memoryMetrics.length).toBeGreaterThan(0);

      // Verify stress test identified system limits
      expect(stressTestResult.maxSustainableRPS).toBeLessThanOrEqual(70); // Should fail above 50 RPS
      expect(stressTestResult.systemLimits.cpuSaturation).toBeDefined();
      expect(stressTestResult.systemLimits.memorySaturation).toBeDefined();
    });
  });

  describe('Combined Load and Stress Testing', () => {
    it('should maintain accurate metrics during mixed workloads', async () => {
      performanceMonitor.startMonitoring(100);

      // Mock request with variable behavior
      const mockRequest = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          const responseTime = Math.random() * 200;
          const shouldFail = Math.random() > 0.9; // 10% failure rate
          
          setTimeout(() => {
            if (shouldFail) {
              reject(new Error('Random failure'));
            } else {
              resolve('success');
            }
          }, responseTime);
        });
      });

      // Run load test and stress test with overlapping time windows
      const loadTestPromise = loadTester.runTest(mockRequest);

      jest.advanceTimersByTime(1000); // Let load test run for a bit

      const stressTestPromise = stressTester.runTest(mockRequest);

      // Advance time to complete both tests
      jest.advanceTimersByTime(4000);

      const [loadResult, stressResult] = await Promise.all([
        loadTestPromise,
        stressTestPromise,
      ]);

      // Verify metrics maintained accuracy
      const allMetrics = performanceMonitor.getMetrics('load_test_response_time');
      const stats = performanceMonitor.getStats('load_test_response_time');

      expect(allMetrics.length).toBeGreaterThan(0);
      expect(stats.stats.p95).toBeGreaterThan(stats.stats.avg);
      expect(loadResult.failedRequests + stressResult.failedRequests).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should recover from performance monitoring interruptions', async () => {
      performanceMonitor.startMonitoring(100);

      const mockRequest = jest.fn().mockResolvedValue('success');

      // Start load test
      const testPromise = loadTester.runTest(mockRequest);

      // Simulate monitoring interruption
      jest.advanceTimersByTime(500);
      performanceMonitor.stopMonitoring();
      jest.advanceTimersByTime(500);
      performanceMonitor.startMonitoring(100);
      jest.advanceTimersByTime(1000);

      const result = await testPromise;

      // Verify test completed despite monitoring interruption
      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.failedRequests).toBe(0);

      // Verify metrics were collected after recovery
      const metrics = performanceMonitor.getMetrics('load_test_response_time');
      expect(metrics.length).toBeGreaterThan(0);
    });

    it('should handle rapid start/stop cycles', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');

      // Rapidly start and stop tests
      const test1 = loadTester.runTest(mockRequest);
      jest.advanceTimersByTime(500);
      loadTester.stop();

      const test2 = stressTester.runTest(mockRequest);
      jest.advanceTimersByTime(500);
      stressTester.stop();

      const [result1, result2] = await Promise.all([test1, test2]);

      // Verify both tests handled interruption gracefully
      expect(result1.totalRequests).toBeGreaterThan(0);
      expect(result2.stressLevels.length).toBe(1);
    });
  });
});
