import { Animated, Easing } from 'react-native';
import { performanceMonitor } from './performanceMonitor';
import { memoryProfiler } from './memoryProfiler';

export type AnimationType = 'spring' | 'timing' | 'decay';
export type AnimationQuality = 'high' | 'medium' | 'low';

interface BaseAnimationConfig {
  type: AnimationType;
  useNativeDriver?: boolean;
  quality?: AnimationQuality;
}

interface SpringConfig extends BaseAnimationConfig {
  type: 'spring';
  config: Animated.SpringAnimationConfig;
}

interface TimingConfig extends BaseAnimationConfig {
  type: 'timing';
  config: Animated.TimingAnimationConfig;
}

interface DecayConfig extends BaseAnimationConfig {
  type: 'decay';
  config: Animated.DecayAnimationConfig;
}

export type AnimationConfig = SpringConfig | TimingConfig | DecayConfig;

export interface OptimizedAnimation {
  animation: Animated.CompositeAnimation;
  value: Animated.Value;
  useNativeDriver: boolean;
  isOptimized: boolean;
  quality: AnimationQuality;
  start: (callback?: Animated.EndCallback) => void;
  stop: () => void;
}

interface AnimationMetrics {
  totalAnimations: number;
  activeAnimations: number;
  droppedFrames: number;
  averageDuration: number;
}

class AnimationOptimizer {
  private static instance: AnimationOptimizer;
  private memoryThreshold: number = 100 * 1024 * 1024; // 100MB
  private frameDropThreshold: number = 2; // Consecutive frame drops
  private frameDropCount: number = 0;
  private lastFrameTimestamp: number = 0;
  private isMonitoring: boolean = false;
  private activeAnimations: Set<OptimizedAnimation> = new Set();
  private metrics: AnimationMetrics = {
    totalAnimations: 0,
    activeAnimations: 0,
    droppedFrames: 0,
    averageDuration: 0,
  };

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  private startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    const monitorFrame = () => {
      const now = Date.now();
      if (this.lastFrameTimestamp) {
        const frameDuration = now - this.lastFrameTimestamp;
        if (frameDuration > (1000 / 60) + 5) { // 5ms threshold
          this.frameDropCount++;
          this.metrics.droppedFrames++;
          performanceMonitor.recordMetric('animation_frame_drop', frameDuration);
        } else {
          this.frameDropCount = Math.max(0, this.frameDropCount - 1);
        }
      }
      this.lastFrameTimestamp = now;
      if (this.isMonitoring) {
        requestAnimationFrame(monitorFrame);
      }
    };

    requestAnimationFrame(monitorFrame);
  }

  private async shouldOptimize(): Promise<boolean> {
    const memorySnapshot = await memoryProfiler.takeSnapshot();
    return (
      memorySnapshot.heapUsed > this.memoryThreshold ||
      this.frameDropCount >= this.frameDropThreshold
    );
  }

  private getOptimizedConfig(
    config: AnimationConfig,
    quality: AnimationQuality
  ): AnimationConfig {
    const optimizedConfig = { ...config };

    switch (quality) {
      case 'low':
        if (config.type === 'spring') {
          optimizedConfig.config = {
            ...config.config,
            tension: (config.config.tension || 170) * 0.7,
            friction: (config.config.friction || 26) * 1.3,
          };
        } else if (config.type === 'timing') {
          optimizedConfig.config = {
            ...config.config,
            duration: (config.config.duration || 250) * 0.8,
            easing: Easing.ease,
          };
        }
        break;

      case 'medium':
        if (config.type === 'spring') {
          optimizedConfig.config = {
            ...config.config,
            tension: (config.config.tension || 170) * 0.85,
            friction: (config.config.friction || 26) * 1.15,
          };
        } else if (config.type === 'timing') {
          optimizedConfig.config = {
            ...config.config,
            duration: (config.config.duration || 250) * 0.9,
          };
        }
        break;
    }

    return optimizedConfig;
  }

  public async createAnimation(config: AnimationConfig): Promise<OptimizedAnimation> {
    const shouldOptimize = await this.shouldOptimize();
    const quality = shouldOptimize
      ? this.frameDropCount > this.frameDropThreshold * 2
        ? 'low'
        : 'medium'
      : 'high';

    const finalConfig = shouldOptimize
      ? this.getOptimizedConfig(config, quality)
      : config;

    const value = new Animated.Value(0);
    const useNativeDriver = finalConfig.useNativeDriver ?? true;

    let animation: Animated.CompositeAnimation;
    switch (finalConfig.type) {
      case 'spring':
        animation = Animated.spring(value, {
          ...finalConfig.config,
          useNativeDriver,
        });
        break;
      case 'timing':
        animation = Animated.timing(value, {
          ...finalConfig.config,
          useNativeDriver,
        });
        break;
      case 'decay':
        animation = Animated.decay(value, {
          ...finalConfig.config,
          useNativeDriver,
        });
        break;
    }

    const optimizedAnimation: OptimizedAnimation = {
      animation,
      value,
      useNativeDriver,
      isOptimized: shouldOptimize,
      quality,
      start: (callback?: Animated.EndCallback) => {
        const startTime = Date.now();
        this.activeAnimations.add(optimizedAnimation);
        this.metrics.activeAnimations = this.activeAnimations.size;
        this.metrics.totalAnimations++;

        animation.start((result) => {
          const duration = Date.now() - startTime;
          this.metrics.averageDuration = (
            this.metrics.averageDuration * (this.metrics.totalAnimations - 1) +
            duration
          ) / this.metrics.totalAnimations;

          this.activeAnimations.delete(optimizedAnimation);
          this.metrics.activeAnimations = this.activeAnimations.size;

          performanceMonitor.recordMetric('animation_completed', duration, {
            type: finalConfig.type,
            quality,
            finished: result.finished,
          });
          if (callback) callback(result);
        });
      },
      stop: () => {
        animation.stop();
        this.activeAnimations.delete(optimizedAnimation);
        this.metrics.activeAnimations = this.activeAnimations.size;
        performanceMonitor.recordMetric('animation_stopped', 1, {
          type: finalConfig.type,
          quality,
        });
      },
    };

    performanceMonitor.recordMetric('animation_created', 1, {
      type: finalConfig.type,
      quality,
      optimized: shouldOptimize,
    });

    return optimizedAnimation;
  }

  // Utility functions for common animations
  public async createFadeAnimation(toValue: number, duration: number = 300): Promise<OptimizedAnimation> {
    return this.createAnimation({
      type: 'timing',
      config: {
        toValue,
        duration,
        useNativeDriver: true,
      },
    });
  }

  public async createSlideAnimation(toValue: number, duration: number = 300): Promise<OptimizedAnimation> {
    return this.createAnimation({
      type: 'spring',
      config: {
        toValue,
        tension: 65,
        friction: 7,
        useNativeDriver: true,
      },
    });
  }

  public async createBounceAnimation(toValue: number): Promise<OptimizedAnimation> {
    return this.createAnimation({
      type: 'spring',
      config: {
        toValue,
        tension: 40,
        friction: 3,
        useNativeDriver: true,
      },
    });
  }

  public async createPulseAnimation(): Promise<OptimizedAnimation> {
    return this.createAnimation({
      type: 'spring',
      config: {
        toValue: 1.2,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      },
    });
  }

  // Helper methods for animation sequences and groups
  public createSequence(animations: OptimizedAnimation[]): Animated.CompositeAnimation {
    return Animated.sequence(animations.map(a => a.animation));
  }

  public createParallel(animations: OptimizedAnimation[]): Animated.CompositeAnimation {
    return Animated.parallel(animations.map(a => a.animation));
  }

  // Convenience methods for timing and spring animations
  public async createTiming(config: Omit<Animated.TimingAnimationConfig, 'useNativeDriver'>): Promise<OptimizedAnimation> {
    return this.createAnimation({
      type: 'timing',
      config: {
        ...config,
        useNativeDriver: true,
      },
    });
  }

  public async createSpring(config: Omit<Animated.SpringAnimationConfig, 'useNativeDriver'>): Promise<OptimizedAnimation> {
    return this.createAnimation({
      type: 'spring',
      config: {
        ...config,
        useNativeDriver: true,
      },
    });
  }

  // Monitoring and metrics
  public getMetrics(): AnimationMetrics {
    return { ...this.metrics };
  }

  public clearMetrics(): void {
    this.metrics = {
      totalAnimations: 0,
      activeAnimations: 0,
      droppedFrames: 0,
      averageDuration: 0,
    };
  }

  public getActiveAnimations(): OptimizedAnimation[] {
    return Array.from(this.activeAnimations);
  }

  public setMemoryThreshold(threshold: number): void {
    this.memoryThreshold = threshold;
  }

  public setFrameDropThreshold(threshold: number): void {
    this.frameDropThreshold = threshold;
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
  }
}

export const animationOptimizer = AnimationOptimizer.getInstance();
