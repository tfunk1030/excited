import { animationOptimizer } from '../animationOptimizer';
import { performanceMonitor } from '../performanceMonitor';
import { memoryProfiler } from '../memoryProfiler';

jest.mock('../performanceMonitor');
jest.mock('../memoryProfiler');

describe('AnimationOptimizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    animationOptimizer.clearMetrics();
    (memoryProfiler.takeSnapshot as jest.Mock).mockResolvedValue({
      heapUsed: 50 * 1024 * 1024, // 50MB
    });
  });

  describe('Basic Animation Creation', () => {
    it('should create timing animation', async () => {
      const animation = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      expect(animation.useNativeDriver).toBe(true);
      expect(animation.isOptimized).toBe(false);
      expect(animation.quality).toBe('high');
    });

    it('should create spring animation', async () => {
      const animation = await animationOptimizer.createSpring({
        toValue: 1,
        tension: 40,
        friction: 7,
      });

      expect(animation.useNativeDriver).toBe(true);
      expect(animation.isOptimized).toBe(false);
      expect(animation.quality).toBe('high');
    });
  });

  describe('Common Animation Utilities', () => {
    it('should create fade animation', async () => {
      const animation = await animationOptimizer.createFadeAnimation(1);
      expect(animation.useNativeDriver).toBe(true);
    });

    it('should create slide animation', async () => {
      const animation = await animationOptimizer.createSlideAnimation(100);
      expect(animation.useNativeDriver).toBe(true);
    });

    it('should create bounce animation', async () => {
      const animation = await animationOptimizer.createBounceAnimation(1);
      expect(animation.useNativeDriver).toBe(true);
    });

    it('should create pulse animation', async () => {
      const animation = await animationOptimizer.createPulseAnimation();
      expect(animation.useNativeDriver).toBe(true);
    });
  });

  describe('Animation Optimization', () => {
    beforeEach(() => {
      (memoryProfiler.takeSnapshot as jest.Mock).mockResolvedValue({
        heapUsed: 150 * 1024 * 1024, // 150MB (above threshold)
      });
    });

    it('should optimize animations under memory pressure', async () => {
      const animation = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      expect(animation.isOptimized).toBe(true);
      expect(animation.quality).toBe('medium');
    });

    it('should track animation metrics', async () => {
      const animation = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      await new Promise<void>((resolve) => {
        animation.start(() => resolve());
      });

      const metrics = animationOptimizer.getMetrics();
      expect(metrics.totalAnimations).toBe(1);
      expect(metrics.activeAnimations).toBe(0);
    });
  });

  describe('Animation Control', () => {
    it('should start and stop animations', async () => {
      const animation = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      const startCallback = jest.fn();
      animation.start(startCallback);

      // Fast-forward timers
      jest.runAllTimers();

      expect(startCallback).toHaveBeenCalled();
      animation.stop();

      const metrics = animationOptimizer.getMetrics();
      expect(metrics.activeAnimations).toBe(0);
    });

    it('should handle multiple animations', async () => {
      const animation1 = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      const animation2 = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      animation1.start();
      animation2.start();

      expect(animationOptimizer.getActiveAnimations().length).toBe(2);

      animation1.stop();
      animation2.stop();

      expect(animationOptimizer.getActiveAnimations().length).toBe(0);
    });
  });

  describe('Animation Sequences', () => {
    it('should create animation sequence', async () => {
      const animation1 = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      const animation2 = await animationOptimizer.createTiming({
        toValue: 0,
        duration: 300,
      });

      const sequence = animationOptimizer.createSequence([animation1, animation2]);
      expect(sequence).toBeDefined();
    });

    it('should create parallel animations', async () => {
      const animation1 = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      const animation2 = await animationOptimizer.createTiming({
        toValue: 0,
        duration: 300,
      });

      const parallel = animationOptimizer.createParallel([animation1, animation2]);
      expect(parallel).toBeDefined();
    });
  });

  describe('Performance Monitoring', () => {
    it('should record metrics', async () => {
      const animation = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      animation.start();
      jest.runAllTimers();

      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'animation_created',
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should track active animations', async () => {
      const animation = await animationOptimizer.createTiming({
        toValue: 1,
        duration: 300,
      });

      animation.start();
      expect(animationOptimizer.getActiveAnimations().length).toBe(1);

      animation.stop();
      expect(animationOptimizer.getActiveAnimations().length).toBe(0);
    });
  });
});
