import { performanceMonitor } from './performanceMonitor';

export interface LoadTestConfig {
  duration?: number;        // Test duration in milliseconds
  rampUp?: number;         // Ramp up time in milliseconds
  targetRPS?: number;      // Target requests per second
  maxConcurrent?: number;  // Maximum concurrent requests
  timeout?: number;        // Request timeout in milliseconds
}

export interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsPerSecond: number;
  errors: Error[];
}

interface RequestResult {
  duration: number;
  success: boolean;
  error?: Error;
}

const DEFAULT_CONFIG: Required<LoadTestConfig> = {
  duration: 60000,     // 1 minute
  rampUp: 5000,       // 5 seconds
  targetRPS: 10,      // 10 requests per second
  maxConcurrent: 50,  // 50 concurrent requests
  timeout: 5000,      // 5 seconds
};

export class LoadTester {
  private config: Required<LoadTestConfig>;
  private results: RequestResult[] = [];
  private errors: Error[] = [];
  private startTime: number = 0;
  private isRunning: boolean = false;
  private activeRequests: number = 0;

  constructor(config: LoadTestConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async runTest(
    requestFn: () => Promise<any>,
    onProgress?: (progress: number) => void
  ): Promise<LoadTestResult> {
    if (this.isRunning) {
      throw new Error('Load test already in progress');
    }

    this.isRunning = true;
    this.startTime = Date.now();
    this.results = [];
    this.errors = [];
    this.activeRequests = 0;

    try {
      await this.executeLoadTest(requestFn, onProgress);
      return this.calculateResults();
    } finally {
      this.isRunning = false;
    }
  }

  private async executeLoadTest(
    requestFn: () => Promise<any>,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const endTime = this.startTime + this.config.duration;
    const requestIntervalBase = 1000 / this.config.targetRPS;

    while (Date.now() < endTime && this.isRunning) {
      const elapsedTime = Date.now() - this.startTime;
      const progress = elapsedTime / this.config.duration;
      onProgress?.(progress);

      // Calculate current RPS based on ramp-up
      const rampUpProgress = Math.min(elapsedTime / this.config.rampUp, 1);
      const currentTargetRPS = this.config.targetRPS * rampUpProgress;
      const currentInterval = 1000 / currentTargetRPS;

      // Check if we can send more requests
      if (this.activeRequests < this.config.maxConcurrent) {
        this.sendRequest(requestFn);
        await this.delay(currentInterval);
      } else {
        await this.delay(10); // Small delay to prevent CPU spinning
      }
    }

    // Wait for remaining requests to complete
    while (this.activeRequests > 0) {
      await this.delay(10);
    }
  }

  private async sendRequest(requestFn: () => Promise<any>): Promise<void> {
    this.activeRequests++;
    const startTime = Date.now();

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), this.config.timeout);
      });

      await Promise.race([requestFn(), timeoutPromise]);

      this.results.push({
        duration: Date.now() - startTime,
        success: true,
      });

      performanceMonitor.recordMetric('load_test_response_time', Date.now() - startTime, {
        type: 'success',
      });
    } catch (error) {
      this.results.push({
        duration: Date.now() - startTime,
        success: false,
        error: error as Error,
      });

      this.errors.push(error as Error);
      performanceMonitor.recordMetric('load_test_response_time', Date.now() - startTime, {
        type: 'error',
        error: (error as Error).message,
      });
    } finally {
      this.activeRequests--;
    }
  }

  private calculateResults(): LoadTestResult {
    const successfulRequests = this.results.filter(r => r.success);
    const responseTimes = this.results.map(r => r.duration).sort((a, b) => a - b);
    const totalDuration = (Date.now() - this.startTime) / 1000; // in seconds

    return {
      totalRequests: this.results.length,
      successfulRequests: successfulRequests.length,
      failedRequests: this.results.length - successfulRequests.length,
      averageResponseTime: this.calculateAverage(responseTimes),
      p95ResponseTime: this.calculatePercentile(responseTimes, 0.95),
      p99ResponseTime: this.calculatePercentile(responseTimes, 0.99),
      requestsPerSecond: this.results.length / totalDuration,
      errors: this.errors,
    };
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const index = Math.ceil(values.length * percentile) - 1;
    return values[index];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public stop(): void {
    this.isRunning = false;
  }

  public getActiveRequests(): number {
    return this.activeRequests;
  }

  public getCurrentRPS(): number {
    const recentWindow = 1000; // 1 second window
    const now = Date.now();
    const recentRequests = this.results.filter(
      r => now - this.startTime - r.duration < recentWindow
    ).length;
    return recentRequests;
  }
}

// Singleton instance
export const loadTester = new LoadTester();

// Helper functions
export const runLoadTest = async (
  requestFn: () => Promise<any>,
  config?: LoadTestConfig,
  onProgress?: (progress: number) => void
): Promise<LoadTestResult> => {
  const tester = new LoadTester(config);
  return tester.runTest(requestFn, onProgress);
};

export const stopLoadTest = (): void => {
  loadTester.stop();
};
