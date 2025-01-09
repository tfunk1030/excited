import { LoadTester, loadTester, runLoadTest, stopLoadTest } from '../loadTester';

describe('LoadTester', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should run a load test with default configuration', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const progressCallback = jest.fn();

      const testPromise = runLoadTest(mockRequest, undefined, progressCallback);
      
      // Fast-forward through the test duration
      jest.advanceTimersByTime(60000); // Default duration

      const result = await testPromise;

      expect(result.totalRequests).toBeGreaterThan(0);
      expect(result.successfulRequests).toBe(result.totalRequests);
      expect(result.failedRequests).toBe(0);
      expect(progressCallback).toHaveBeenCalled();
    });

    it('should handle request failures', async () => {
      const mockRequest = jest.fn().mockRejectedValue(new Error('Test error'));
      
      const testPromise = runLoadTest(mockRequest, {
        duration: 1000,
        targetRPS: 1,
      });

      jest.advanceTimersByTime(1000);

      const result = await testPromise;

      expect(result.failedRequests).toBeGreaterThan(0);
      expect(result.errors[0].message).toBe('Test error');
    });

    it('should respect request timeout', async () => {
      const mockRequest = jest.fn().mockImplementation(() => new Promise(resolve => {
        setTimeout(resolve, 6000); // Longer than timeout
      }));

      const testPromise = runLoadTest(mockRequest, {
        duration: 1000,
        targetRPS: 1,
        timeout: 100,
      });

      jest.advanceTimersByTime(1000);

      const result = await testPromise;

      expect(result.failedRequests).toBeGreaterThan(0);
      expect(result.errors[0].message).toBe('Request timeout');
    });
  });

  describe('Performance Metrics', () => {
    it('should calculate response time statistics', async () => {
      const mockRequest = jest.fn()
        .mockImplementationOnce(() => Promise.resolve(100))
        .mockImplementationOnce(() => Promise.resolve(200))
        .mockImplementationOnce(() => Promise.resolve(300));

      const testPromise = runLoadTest(mockRequest, {
        duration: 1000,
        targetRPS: 3,
      });

      jest.advanceTimersByTime(1000);

      const result = await testPromise;

      expect(result.averageResponseTime).toBeGreaterThan(0);
      expect(result.p95ResponseTime).toBeGreaterThan(0);
      expect(result.p99ResponseTime).toBeGreaterThan(0);
    });

    it('should track requests per second', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const tester = new LoadTester({
        duration: 1000,
        targetRPS: 10,
      });

      const testPromise = tester.runTest(mockRequest);
      
      // Check RPS during test
      jest.advanceTimersByTime(500);
      expect(tester.getCurrentRPS()).toBeGreaterThan(0);

      jest.advanceTimersByTime(500);
      const result = await testPromise;

      expect(result.requestsPerSecond).toBeGreaterThan(0);
    });
  });

  describe('Load Control', () => {
    it('should respect maximum concurrent requests', async () => {
      const mockRequest = jest.fn().mockImplementation(() => new Promise(resolve => {
        setTimeout(resolve, 100);
      }));

      const tester = new LoadTester({
        duration: 1000,
        targetRPS: 100,
        maxConcurrent: 5,
      });

      const testPromise = tester.runTest(mockRequest);
      
      jest.advanceTimersByTime(100);
      expect(tester.getActiveRequests()).toBeLessThanOrEqual(5);

      jest.advanceTimersByTime(900);
      await testPromise;
    });

    it('should handle ramp-up period', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      
      const testPromise = runLoadTest(mockRequest, {
        duration: 1000,
        rampUp: 500,
        targetRPS: 10,
      });

      // Check RPS during ramp-up
      jest.advanceTimersByTime(250);
      expect(mockRequest).toHaveBeenCalled();
      const initialCallCount = mockRequest.mock.calls.length;

      // Check RPS after ramp-up
      jest.advanceTimersByTime(750);
      await testPromise;
      
      const finalCallCount = mockRequest.mock.calls.length;
      expect(finalCallCount).toBeGreaterThan(initialCallCount);
    });
  });

  describe('Test Control', () => {
    it('should stop test on demand', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const tester = new LoadTester({
        duration: 10000,
        targetRPS: 10,
      });

      const testPromise = tester.runTest(mockRequest);
      
      jest.advanceTimersByTime(1000);
      tester.stop();
      
      const result = await testPromise;
      expect(result.totalRequests).toBeGreaterThan(0);
    });

    it('should prevent concurrent test runs', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const tester = new LoadTester();

      const firstTest = tester.runTest(mockRequest);
      
      await expect(tester.runTest(mockRequest)).rejects.toThrow(
        'Load test already in progress'
      );

      jest.advanceTimersByTime(60000);
      await firstTest;
    });
  });

  describe('Global Instance', () => {
    it('should provide singleton access', () => {
      expect(loadTester).toBeInstanceOf(LoadTester);
    });

    it('should support global test control', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      
      const testPromise = runLoadTest(mockRequest, {
        duration: 10000,
        targetRPS: 10,
      });

      jest.advanceTimersByTime(1000);
      stopLoadTest();
      
      const result = await testPromise;
      expect(result.totalRequests).toBeGreaterThan(0);
    });
  });
});
