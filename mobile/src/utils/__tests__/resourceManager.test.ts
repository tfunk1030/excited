import { NativeEventEmitter, NativeModules } from 'react-native';
import { resourceManager, registerImageResource, registerCacheResource, registerAnimationResource } from '../resourceManager';
import { performanceMonitor } from '../performanceMonitor';

// Mock dependencies
jest.mock('../performanceMonitor');
jest.mock('react-native', () => ({
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
  NativeModules: {
    MemoryWarning: {},
  },
}));

describe('ResourceManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset manager state
    resourceManager.cleanupAll();
  });

  describe('Resource Registration', () => {
    it('should register a resource', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      const info = resourceManager.getResourceInfo('test');
      expect(info).toBeDefined();
      expect(info?.type).toBe('image');
      expect(info?.size).toBe(1000);
    });

    it('should track metrics on registration', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      const metrics = resourceManager.getMetrics();
      expect(metrics.totalSize).toBe(1000);
      expect(metrics.resourceCount).toBe(1);
    });

    it('should trigger cleanup when threshold is reached', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      // Register a large resource that exceeds threshold
      await resourceManager.registerResource('large', 'image', 50 * 1024 * 1024, cleanup);

      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'resource_cleanup',
        expect.any(Number),
        expect.any(Object)
      );
    });
  });

  describe('Resource Access', () => {
    it('should update lastAccessed time', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      const beforeAccess = resourceManager.getResourceInfo('test')?.lastAccessed;
      await new Promise((resolve) => setTimeout(resolve, 10));
      resourceManager.accessResource('test');
      const afterAccess = resourceManager.getResourceInfo('test')?.lastAccessed;

      expect(afterAccess).toBeGreaterThan(beforeAccess!);
    });
  });

  describe('Resource Cleanup', () => {
    it('should cleanup old resources', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      // Fast-forward time
      jest.advanceTimersByTime(6 * 60 * 1000); // 6 minutes

      await resourceManager.cleanup();
      expect(cleanup).toHaveBeenCalled();
      expect(resourceManager.getResourceInfo('test')).toBeNull();
    });

    it('should handle cleanup errors', async () => {
      const error = new Error('Cleanup failed');
      const cleanup = jest.fn().mockRejectedValue(error);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      await expect(resourceManager.cleanup()).rejects.toThrow('Cleanup failed');
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'resource_cleanup_error',
        1,
        expect.any(Object)
      );
    });

    it('should cleanup all resources on force cleanup', async () => {
      const cleanup1 = jest.fn().mockResolvedValue(undefined);
      const cleanup2 = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test1', 'image', 1000, cleanup1);
      await resourceManager.registerResource('test2', 'cache', 2000, cleanup2);

      await resourceManager.cleanupAll();
      expect(cleanup1).toHaveBeenCalled();
      expect(cleanup2).toHaveBeenCalled();
      expect(resourceManager.listResources()).toHaveLength(0);
    });
  });

  describe('Memory Warning', () => {
    it('should cleanup on memory warning', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      // Simulate memory warning
      const emitter = new NativeEventEmitter(NativeModules.MemoryWarning);
      (emitter.addListener as jest.Mock).mock.calls[0][1]();

      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'memory_warning_cleanup',
        1,
        expect.any(Object)
      );
    });
  });

  describe('Helper Functions', () => {
    it('should register image resource', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await registerImageResource('test', 1000, cleanup);

      const info = resourceManager.getResourceInfo('test');
      expect(info?.type).toBe('image');
    });

    it('should register cache resource', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await registerCacheResource('test', 1000, cleanup);

      const info = resourceManager.getResourceInfo('test');
      expect(info?.type).toBe('cache');
    });

    it('should register animation resource', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await registerAnimationResource('test', 1000, cleanup);

      const info = resourceManager.getResourceInfo('test');
      expect(info?.type).toBe('animation');
    });
  });

  describe('Resource Information', () => {
    it('should list all resources', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test1', 'image', 1000, cleanup);
      await resourceManager.registerResource('test2', 'cache', 2000, cleanup);

      const resources = resourceManager.listResources();
      expect(resources).toHaveLength(2);
      expect(resources[0].id).toBe('test1');
      expect(resources[1].id).toBe('test2');
    });

    it('should get resource info', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      const info = resourceManager.getResourceInfo('test');
      expect(info).toBeDefined();
      expect(info?.id).toBe('test');
      expect(info?.type).toBe('image');
      expect(info?.size).toBe(1000);
      // Ensure cleanup function is not exposed
      expect(info).not.toHaveProperty('cleanup');
    });

    it('should return null for non-existent resource', () => {
      const info = resourceManager.getResourceInfo('nonexistent');
      expect(info).toBeNull();
    });
  });

  describe('Cleanup Interval', () => {
    it('should setup cleanup interval', () => {
      jest.useFakeTimers();
      const cleanup = jest.fn().mockResolvedValue(undefined);
      resourceManager.registerResource('test', 'image', 1000, cleanup);

      // Fast-forward time
      jest.advanceTimersByTime(60 * 1000); // 1 minute

      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'resource_cleanup',
        expect.any(Number),
        expect.any(Object)
      );

      jest.useRealTimers();
    });
  });

  describe('Destroy', () => {
    it('should cleanup everything on destroy', async () => {
      const cleanup = jest.fn().mockResolvedValue(undefined);
      await resourceManager.registerResource('test', 'image', 1000, cleanup);

      resourceManager.destroy();

      expect(cleanup).toHaveBeenCalled();
      expect(resourceManager.listResources()).toHaveLength(0);
    });

    it('should remove event listeners on destroy', () => {
      const emitter = new NativeEventEmitter(NativeModules.MemoryWarning);
      resourceManager.destroy();

      expect(emitter.removeAllListeners).toHaveBeenCalledWith('memoryWarning');
    });
  });
});
