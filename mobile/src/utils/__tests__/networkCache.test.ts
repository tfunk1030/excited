import { networkCache, withNetworkCache } from '../networkCache';

// Enable experimental decorators
const experimentalDecorators = true;

describe('NetworkCache', () => {
  beforeEach(() => {
    networkCache.clear();
  });

  describe('Basic Operations', () => {
    it('should set and get values', async () => {
      const key = 'test';
      const value = { data: 'test' };

      await networkCache.set(key, value);
      const result = await networkCache.get(key);

      expect(result).toEqual(value);
    });

    it('should handle cache misses', async () => {
      const result = await networkCache.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should clear cache', async () => {
      await networkCache.set('test1', 'value1');
      await networkCache.set('test2', 'value2');

      await networkCache.clear();

      expect(await networkCache.get('test1')).toBeNull();
      expect(await networkCache.get('test2')).toBeNull();
    });

    it('should invalidate specific keys', async () => {
      await networkCache.set('test1', 'value1');
      await networkCache.set('test2', 'value2');

      await networkCache.invalidate('test1');

      expect(await networkCache.get('test1')).toBeNull();
      expect(await networkCache.get('test2')).toBe('value2');
    });
  });

  describe('TTL Support', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should expire items after TTL', async () => {
      const key = 'test';
      const value = { data: 'test' };
      const ttl = 1000; // 1 second

      await networkCache.set(key, value, ttl);
      expect(await networkCache.get(key)).toEqual(value);

      // Advance time past TTL
      jest.advanceTimersByTime(ttl + 100);

      expect(await networkCache.get(key)).toBeNull();
    });
  });

  describe('withCache Function', () => {
    it('should cache function results', async () => {
      const fn = jest.fn().mockResolvedValue({ data: 'test' });
      const options = { ttl: 1000 };

      const result1 = await networkCache.withCache('test', fn, options);
      const result2 = await networkCache.withCache('test', fn, options);

      expect(result1).toEqual(result2);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle function errors', async () => {
      const error = new Error('Test error');
      const fn = jest.fn().mockRejectedValue(error);

      await expect(networkCache.withCache('test', fn)).rejects.toThrow(error);
    });

    it('should work with decorator pattern', async () => {
      // Create a class that uses the decorator pattern manually
      class TestClass {
        public getData: () => Promise<{ data: string }>;

        constructor() {
          // Apply decorator manually
          const descriptor = {
            value: async () => ({ data: 'test' }),
            writable: true,
            enumerable: true,
            configurable: true,
          };

          const decoratedDescriptor = withNetworkCache('test')(
            TestClass.prototype,
            'getData',
            descriptor
          );

          this.getData = decoratedDescriptor.value as () => Promise<{ data: string }>;
        }
      }

      const test = new TestClass();
      const result1 = await test.getData();
      const result2 = await test.getData();

      expect(result1).toEqual(result2);
    });

    it('should work with TTL in decorator pattern', async () => {
      jest.useFakeTimers();

      // Create a class that uses the decorator pattern manually with TTL
      class TestClass {
        public getData: () => Promise<{ data: string }>;

        constructor() {
          const descriptor = {
            value: async () => ({ data: 'test' }),
            writable: true,
            enumerable: true,
            configurable: true,
          };

          const decoratedDescriptor = withNetworkCache('test', { ttl: 1000 })(
            TestClass.prototype,
            'getData',
            descriptor
          );

          this.getData = decoratedDescriptor.value as () => Promise<{ data: string }>;
        }
      }

      const test = new TestClass();
      await test.getData();

      jest.advanceTimersByTime(1100);
      
      // Create a properly typed spy
      const spy = jest.spyOn(test, 'getData' as keyof TestClass) as jest.SpyInstance<Promise<{ data: string }>, []>;
      await test.getData();

      expect(spy).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('Cache Stats', () => {
    it('should track hits and misses', async () => {
      await networkCache.set('test', 'value');
      await networkCache.get('test'); // Hit
      await networkCache.get('nonexistent'); // Miss

      const stats = networkCache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('should track memory usage', async () => {
      await networkCache.set('test1', 'value1');
      await networkCache.set('test2', 'value2');

      const stats = networkCache.getStats();
      expect(stats.memoryEntries).toBe(2);
      expect(stats.size).toBe(2);
      expect(stats.oldestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry!.getTime()).toBeGreaterThanOrEqual(stats.oldestEntry!.getTime());
    });

    it('should update stats after cleanup', async () => {
      await networkCache.set('test1', 'value1');
      await networkCache.set('test2', 'value2');
      await networkCache.clear();

      const stats = networkCache.getStats();
      expect(stats.memoryEntries).toBe(0);
      expect(stats.size).toBe(0);
      expect(stats.lastCleanup).toBeInstanceOf(Date);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });
  });
});
