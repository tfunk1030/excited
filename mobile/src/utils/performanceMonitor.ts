export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export interface PerformanceThreshold {
  name: string;
  warning: number;
  critical: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private listeners: Map<string, ((metric: PerformanceMetric) => void)[]> = new Map();
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private readonly DEFAULT_INTERVAL = 5000; // 5 seconds

  constructor() {
    // Set default thresholds
    this.setThreshold('memory_usage', { name: 'memory_usage', warning: 0.7, critical: 0.9 });
    this.setThreshold('response_time', { name: 'response_time', warning: 500, critical: 1000 });
    this.setThreshold('frame_time', { name: 'frame_time', warning: 16, critical: 33 });
  }

  public startMonitoring(interval: number = this.DEFAULT_INTERVAL): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.checkThresholds();
    }, interval);
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  public recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
    this.notifyListeners(metric);
    this.checkThreshold(metric);
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public setThreshold(name: string, threshold: PerformanceThreshold): void {
    this.thresholds.set(name, threshold);
  }

  public addListener(name: string, callback: (metric: PerformanceMetric) => void): void {
    const listeners = this.listeners.get(name) || [];
    listeners.push(callback);
    this.listeners.set(name, listeners);
  }

  public removeListener(name: string, callback: (metric: PerformanceMetric) => void): void {
    const listeners = this.listeners.get(name) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        this.listeners.delete(name);
      } else {
        this.listeners.set(name, listeners);
      }
    }
  }

  public getAverageMetric(name: string, duration: number = 60000): number {
    const now = Date.now();
    const relevantMetrics = this.metrics.filter(
      m => m.name === name && m.timestamp > now - duration
    );

    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / relevantMetrics.length;
  }

  public getMetricRange(name: string, start: number, end: number): PerformanceMetric[] {
    return this.metrics.filter(
      m => m.name === name && m.timestamp >= start && m.timestamp <= end
    );
  }

  private checkThresholds(): void {
    const latestMetrics = new Map<string, PerformanceMetric>();
    
    // Get latest value for each metric
    this.metrics.forEach(metric => {
      const current = latestMetrics.get(metric.name);
      if (!current || metric.timestamp > current.timestamp) {
        latestMetrics.set(metric.name, metric);
      }
    });

    // Check each metric against its threshold
    latestMetrics.forEach(metric => {
      this.checkThreshold(metric);
    });
  }

  private checkThreshold(metric: PerformanceMetric): void {
    const threshold = this.thresholds.get(metric.name);
    if (!threshold) return;

    if (metric.value >= threshold.critical) {
      this.notifyListeners(`${metric.name}_critical`, metric);
    } else if (metric.value >= threshold.warning) {
      this.notifyListeners(`${metric.name}_warning`, metric);
    }
  }

  private notifyListeners(metricOrName: string | PerformanceMetric, metric?: PerformanceMetric): void {
    const name = typeof metricOrName === 'string' ? metricOrName : metricOrName.name;
    const value = metric || (typeof metricOrName === 'string' ? undefined : metricOrName);
    
    if (!value) return;

    const listeners = this.listeners.get(name) || [];
    listeners.forEach(listener => {
      try {
        listener(value);
      } catch (error) {
        console.error(`Error in performance listener for ${name}:`, error);
      }
    });
  }

  public getStatistics(name: string, duration: number = 60000): {
    min: number;
    max: number;
    average: number;
    count: number;
    standardDeviation: number;
  } {
    const now = Date.now();
    const metrics = this.metrics.filter(
      m => m.name === name && m.timestamp > now - duration
    );

    if (metrics.length === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        count: 0,
        standardDeviation: 0,
      };
    }

    const values = metrics.map(m => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - average, 2));
    const standardDeviation = Math.sqrt(
      squareDiffs.reduce((a, b) => a + b, 0) / values.length
    );

    return {
      min,
      max,
      average,
      count: values.length,
      standardDeviation,
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
