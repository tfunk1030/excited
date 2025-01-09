import { StressTester, stressTester, runStressTest, stopStressTest } from '../stressTester';

describe('StressTester', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should run a stress test with default configuration', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const progressCallback = jest.fn();

      const testPromise = runStressTest(mockRequest, undefined, progressCallback);
      
      // Fast-forward through all stress levels
      for (let i = 0; i < 5; i++) { // Default 5 stress levels
        jest.advanceTimersByTime(35000); // 30s test + 5s stabilization
      }

      const result = await testPromise;

      expect(result.maxSustainableRPS).toBeGreaterThan(0);
      expect(result.stressLevels.length).toBeGreaterThan(0);
      expect(progressCallback).toHaveBeenCalled();
    });

    it('should handle request failures', async () => {
      const mockRequest = jest.fn()
        .mockImplementation(() => {
          const shouldFail = Math.random() > 0.8; // 20% failure rate
          return shouldFail 
            ? Promise.reject(new Error('Test error'))
            : Promise.resolve('success');
        });
      
      const testPromise = runStressTest(mockRequest, {
        stressLevels: [10, 20],
        durationPerLevel: 1000,
        stabilizationTime: 100,
        cooldownTime: 100,
      });

      // Fast-forward through both stress levels
      jest.advanceTimersByTime(2400); // (1000ms + 100ms + 100ms) * 2

      const result = await testPromise;

      expect(result.stressLevels.some(level => level.errorRate > 0)).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    it('should track system limits', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      
      const testPromise = runStressTest(mockRequest, {
        stressLevels: [10],
        durationPerLevel: 1000,
        stabilizationTime: 100,
      });

      jest.advanceTimersByTime(1100);

      const result = await testPromise;

      expect(result.systemLimits).toBeDefined();
      expect(typeof result.systemLimits.cpuSaturation).toBe('number');
    });

    it('should calculate max sustainable RPS', async () => {
      const mockRequest = jest.fn()
        .mockImplementation(() => {
          const rps = stressTester.getResults()[0]?.rps || 0;
          const shouldFail = rps > 100; // Fail above 100 RPS
          return shouldFail
            ? Promise.reject(new Error('Overload'))
            : Promise.resolve('success');
        });

      const testPromise = runStressTest(mockRequest, {
        stressLevels: [50, 100, 150],
        durationPerLevel: 1000,
        stabilizationTime: 100,
        failureThreshold: 0.1,
      });

      // Fast-forward through all levels
      jest.advanceTimersByTime(3300); // (1000ms + 100ms) * 3

      const result = await testPromise;

      expect(result.maxSustainableRPS).toBe(100);
      expect(result.stressLevels.find(level => level.rps > 100)?.success).toBe(false);
    });
  });

  describe('Test Control', () => {
    it('should stop test on high error rate', async () => {
      const mockRequest = jest.fn()
        .mockImplementation(() => {
          const rps = stressTester.getResults()[0]?.rps || 0;
          const shouldFail = rps > 50; // High failure rate above 50 RPS
          return shouldFail
            ? Promise.reject(new Error('Overload'))
            : Promise.resolve('success');
        });

      const testPromise = runStressTest(mockRequest, {
        stressLevels: [10, 50, 100, 200],
        durationPerLevel: 1000,
        stabilizationTime: 100,
        maxErrorRate: 0.15,
      });

      // Fast-forward until test stops
      jest.advanceTimersByTime(4400); // (1000ms + 100ms) * 4

      const result = await testPromise;

      expect(result.stressLevels.length).toBeLessThan(4); // Should stop before all levels
    });

    it('should handle manual test stop', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const tester = new StressTester({
        stressLevels: [10, 50, 100],
        durationPerLevel: 1000,
      });

      const testPromise = tester.runTest(mockRequest);
      
      jest.advanceTimersByTime(1100); // Complete first level
      tester.stop();
      
      const result = await testPromise;
      expect(result.stressLevels.length).toBe(1); // Only first level completed
    });

    it('should prevent concurrent test runs', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const tester = new StressTester();

      const firstTest = tester.runTest(mockRequest);
      
      await expect(tester.runTest(mockRequest)).rejects.toThrow(
        'Stress test already in progress'
      );

      jest.advanceTimersByTime(60000);
      await firstTest;
    });
  });

  describe('Progress Tracking', () => {
    it('should report progress correctly', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      const progressCallback = jest.fn();

      const testPromise = runStressTest(mockRequest, {
        stressLevels: [10, 20],
        durationPerLevel: 1000,
        stabilizationTime: 100,
      }, progressCallback);

      // First level
      jest.advanceTimersByTime(1100);
      expect(progressCallback).toHaveBeenCalledWith(0, 0.5);

      // Second level
      jest.advanceTimersByTime(1100);
      expect(progressCallback).toHaveBeenCalledWith(1, 1);

      await testPromise;
    });
  });

  describe('Global Instance', () => {
    it('should provide singleton access', () => {
      expect(stressTester).toBeInstanceOf(StressTester);
    });

    it('should support global test control', async () => {
      const mockRequest = jest.fn().mockResolvedValue('success');
      
      const testPromise = runStressTest(mockRequest, {
        stressLevels: [10, 20, 30],
        durationPerLevel: 1000,
        stabilizationTime: 100,
      });

      jest.advanceTimersByTime(1100);
      stopStressTest();
      
      const result = await testPromise;
      expect(result.stressLevels.length).toBe(1); // Only first level completed
    });
  });
});
