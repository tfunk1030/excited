import { performanceMonitor } from './performanceMonitor';
import { LoadTester, LoadTestConfig, LoadTestResult } from './loadTester';

export interface StressTestConfig extends LoadTestConfig {
  stressLevels: number[];          // Array of RPS levels to test
  durationPerLevel: number;        // Duration to maintain each stress level (ms)
  stabilizationTime: number;       // Time to wait for system stabilization (ms)
  failureThreshold: number;        // Error rate threshold to consider level failed
  maxErrorRate: number;           // Maximum allowed error rate before stopping
  cooldownTime: number;           // Time between stress levels (ms)
}

export interface StressTestResult extends LoadTestResult {
  maxSustainableRPS: number;
  stressLevels: {
    rps: number;
    errorRate: number;
    averageResponseTime: number;
    success: boolean;
  }[];
  systemLimits: {
    cpuSaturation?: number;
    memorySaturation?: number;
    networkSaturation?: number;
  };
}

const DEFAULT_CONFIG: Partial<StressTestConfig> = {
  stressLevels: [10, 50, 100, 200, 500],
  durationPerLevel: 30000,        // 30 seconds
  stabilizationTime: 5000,        // 5 seconds
  failureThreshold: 0.1,          // 10% error rate
  maxErrorRate: 0.2,              // 20% error rate
  cooldownTime: 5000,             // 5 seconds
};

export class StressTester {
  private config: StressTestConfig;
  private loadTester: LoadTester;
  private isRunning: boolean = false;
  private results: StressTestResult['stressLevels'] = [];

  constructor(config: Partial<StressTestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as StressTestConfig;
    this.loadTester = new LoadTester();
  }

  public async runTest(
    requestFn: () => Promise<any>,
    onProgress?: (level: number, progress: number) => void
  ): Promise<StressTestResult> {
    if (this.isRunning) {
      throw new Error('Stress test already in progress');
    }

    this.isRunning = true;
    this.results = [];

    try {
      return await this.executeStressTest(requestFn, onProgress);
    } finally {
      this.isRunning = false;
    }
  }

  private async executeStressTest(
    requestFn: () => Promise<any>,
    onProgress?: (level: number, progress: number) => void
  ): Promise<StressTestResult> {
    let maxSustainableRPS = 0;

    for (let i = 0; i < this.config.stressLevels.length && this.isRunning; i++) {
      const rps = this.config.stressLevels[i];
      
      // Wait for system stabilization
      await this.delay(this.config.stabilizationTime);

      // Run load test at current stress level
      const result = await this.loadTester.runTest(requestFn, {
        duration: this.config.durationPerLevel,
        targetRPS: rps,
        rampUp: this.config.stabilizationTime,
      });

      const errorRate = result.failedRequests / result.totalRequests;
      const levelResult = {
        rps,
        errorRate,
        averageResponseTime: result.averageResponseTime,
        success: errorRate <= this.config.failureThreshold,
      };

      this.results.push(levelResult);
      onProgress?.(i, (i + 1) / this.config.stressLevels.length);

      // Update max sustainable RPS if level was successful
      if (levelResult.success) {
        maxSustainableRPS = rps;
      }

      // Check if we should stop the test
      if (errorRate > this.config.maxErrorRate) {
        break;
      }

      // Cooldown period between levels
      if (i < this.config.stressLevels.length - 1) {
        await this.delay(this.config.cooldownTime);
      }
    }

    return {
      maxSustainableRPS,
      stressLevels: this.results,
      systemLimits: this.calculateSystemLimits(),
      totalRequests: this.results.reduce((sum, level) => sum + level.rps * this.config.durationPerLevel / 1000, 0),
      successfulRequests: this.results.reduce((sum, level) => 
        sum + level.rps * this.config.durationPerLevel / 1000 * (1 - level.errorRate), 0),
      failedRequests: this.results.reduce((sum, level) => 
        sum + level.rps * this.config.durationPerLevel / 1000 * level.errorRate, 0),
      averageResponseTime: this.results.reduce((sum, level) => sum + level.averageResponseTime, 0) / this.results.length,
      p95ResponseTime: Math.max(...this.results.map(level => level.averageResponseTime * 1.5)), // Estimate
      p99ResponseTime: Math.max(...this.results.map(level => level.averageResponseTime * 2)), // Estimate
      requestsPerSecond: maxSustainableRPS,
      errors: [], // Detailed errors not tracked at stress test level
    };
  }

  private calculateSystemLimits(): StressTestResult['systemLimits'] {
    const metrics = performanceMonitor.getMetrics('system_resources');
    if (!metrics.length) return {};

    const recentMetrics = metrics.slice(-10);
    const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      cpuSaturation: average(recentMetrics.map(m => m.value)),
      memorySaturation: performanceMonitor.getMetrics('memory_usage')
        .slice(-10)
        .reduce((max, m) => Math.max(max, m.value), 0),
      networkSaturation: performanceMonitor.getMetrics('network_usage')
        .slice(-10)
        .reduce((max, m) => Math.max(max, m.value), 0),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public stop(): void {
    this.isRunning = false;
    this.loadTester.stop();
  }

  public getResults(): StressTestResult['stressLevels'] {
    return [...this.results];
  }
}

// Singleton instance
export const stressTester = new StressTester();

// Helper functions
export const runStressTest = async (
  requestFn: () => Promise<any>,
  config?: Partial<StressTestConfig>,
  onProgress?: (level: number, progress: number) => void
): Promise<StressTestResult> => {
  const tester = new StressTester(config);
  return tester.runTest(requestFn, onProgress);
};

export const stopStressTest = (): void => {
  stressTester.stop();
};
