import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStatePersistence, createTransform, compressTransform } from '../statePersistence';
import { performanceMonitor } from '../performanceMonitor';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../performanceMonitor');

describe('StatePersistence', () => {
  const TEST_CONFIG = {
    key: 'test',
    version: 1,
    throttle: 0, // Disable throttling for tests
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear AsyncStorage
    AsyncStorage.clear();
  });

  describe('Basic Operations', () => {
    it('should save and load state', async () => {
      const persistence = createStatePersistence(TEST_CONFIG);
      const testState = { test: 'data' };

      await persistence.saveState(testState);
      const loadedState = await persistence.loadState();

      expect(loadedState).toEqual(testState);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });

    it('should handle null state gracefully', async () => {
      const persistence = createStatePersistence(TEST_CONFIG);
      const loadedState = await persistence.loadState();

      expect(loadedState).toBeNull();
    });

    it('should clear state', async () => {
      const persistence = createStatePersistence(TEST_CONFIG);
      const testState = { test: 'data' };

      await persistence.saveState(testState);
      await persistence.clearState();
      const loadedState = await persistence.loadState();

      expect(loadedState).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('State Filtering', () => {
    it('should respect whitelist', async () => {
      const persistence = createStatePersistence({
        ...TEST_CONFIG,
        whitelist: ['include'],
      });

      const testState = {
        include: 'keep',
        exclude: 'remove',
      };

      await persistence.saveState(testState);
      const loadedState = await persistence.loadState();

      expect(loadedState).toHaveProperty('include');
      expect(loadedState).not.toHaveProperty('exclude');
    });

    it('should respect blacklist', async () => {
      const persistence = createStatePersistence({
        ...TEST_CONFIG,
        blacklist: ['exclude'],
      });

      const testState = {
        include: 'keep',
        exclude: 'remove',
      };

      await persistence.saveState(testState);
      const loadedState = await persistence.loadState();

      expect(loadedState).toHaveProperty('include');
      expect(loadedState).not.toHaveProperty('exclude');
    });
  });

  describe('State Transforms', () => {
    it('should apply transforms correctly', async () => {
      const testTransform = createTransform(
        // inbound (load)
        (state) => ({ ...state, loaded: true }),
        // outbound (save)
        (state) => ({ ...state, saved: true })
      );

      const persistence = createStatePersistence({
        ...TEST_CONFIG,
        transforms: [testTransform],
      });

      const testState = { test: 'data' };
      await persistence.saveState(testState);
      const loadedState = await persistence.loadState();

      expect(loadedState).toHaveProperty('loaded', true);
      expect(loadedState).toHaveProperty('saved', true);
    });

    it('should handle compress transform', async () => {
      const persistence = createStatePersistence({
        ...TEST_CONFIG,
        transforms: [compressTransform],
      });

      const testState = { test: 'data' };
      await persistence.saveState(testState);
      const loadedState = await persistence.loadState();

      expect(loadedState).toEqual(testState);
    });
  });

  describe('Error Handling', () => {
    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(error);

      const persistence = createStatePersistence(TEST_CONFIG);
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await persistence.saveState({ test: 'data' });

      expect(consoleError).toHaveBeenCalled();
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'state_persistence_error',
        1,
        expect.any(Object)
      );

      consoleError.mockRestore();
    });

    it('should handle load errors', async () => {
      const error = new Error('Load failed');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(error);

      const persistence = createStatePersistence(TEST_CONFIG);
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      const loadedState = await persistence.loadState();

      expect(loadedState).toBeNull();
      expect(consoleError).toHaveBeenCalled();
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'state_persistence_error',
        1,
        expect.any(Object)
      );

      consoleError.mockRestore();
    });
  });

  describe('Performance Monitoring', () => {
    it('should track persistence metrics', async () => {
      const persistence = createStatePersistence(TEST_CONFIG);
      const testState = { test: 'data' };

      await persistence.saveState(testState);
      await persistence.loadState();

      const metrics = persistence.getMetrics();
      expect(metrics.saveCount).toBe(1);
      expect(metrics.loadCount).toBe(1);
      expect(metrics.errorCount).toBe(0);
      expect(metrics.lastSave).toBeGreaterThan(0);
      expect(metrics.averageSaveTime).toBeGreaterThanOrEqual(0);
    });

    it('should record performance metrics', async () => {
      const persistence = createStatePersistence(TEST_CONFIG);
      const testState = { test: 'data' };

      await persistence.saveState(testState);

      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'state_persistence_save',
        expect.any(Number),
        expect.any(Object)
      );
    });
  });

  describe('Throttling', () => {
    it('should throttle save operations', async () => {
      const persistence = createStatePersistence({
        ...TEST_CONFIG,
        throttle: 100,
      });

      const testState1 = { test: 'data1' };
      const testState2 = { test: 'data2' };

      // Start two save operations in quick succession
      const save1 = persistence.saveState(testState1);
      const save2 = persistence.saveState(testState2);

      await Promise.all([save1, save2]);

      // Only the last save should be persisted
      const loadedState = await persistence.loadState();
      expect(loadedState).toEqual(testState2);

      // AsyncStorage.setItem should only be called once
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('Versioning', () => {
    it('should handle version changes', async () => {
      // Save state with version 1
      const persistence1 = createStatePersistence({
        ...TEST_CONFIG,
        version: 1,
      });
      await persistence1.saveState({ test: 'data' });

      // Create new instance with version 2
      const persistence2 = createStatePersistence({
        ...TEST_CONFIG,
        version: 2,
      });
      const loadedState = await persistence2.loadState();

      // Should not load state from different version
      expect(loadedState).toBeNull();
    });
  });
});
