import { PerformanceMetric, PerformanceThreshold } from '../../performanceMonitor';

class MockPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private listeners: Map<string, ((metric: PerformanceMetric) => void)[]> = new Map();

  public recordMetric = jest.fn((name: string, value: number) => {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };

    const existingMetrics = this.metrics.get(name) || [];
    existingMetrics.push(metric);
    this.metrics.set(name, existingMetrics);

    this.notifyListeners(name, metric);
    this.checkThreshold(metric);
  });

  public getMetrics = jest.fn((name?: string): PerformanceMetric[] => {
    if (name) {
      return this.metrics.get(name) || [];
    }
    return Array.from(this.metrics.values()).flat();
  });

  public clearMetrics = jest.fn(() => {
    this.metrics.clear();
  });

  public setThreshold = jest.fn((name: string, threshold: PerformanceThreshold) => {
    this.thresholds.set(name, threshold);
  });

  public addListener = jest.fn((name: string, callback: (metric: PerformanceMetric) => void) => {
    const listeners = this.listeners.get(name) || [];
    listeners.push(callback);
    this.listeners.set(name, listeners);
  });

  public removeListener = jest.fn((name: string, callback: (metric: PerformanceMetric) => void) => {
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
  });

  public getAverageMetric = jest.fn((name: string, duration: number = 60000): number => {
    const metrics = this.getMetrics(name);
    const now = Date.now();
    const relevantMetrics = metrics.filter(m => m.timestamp > now - duration);

    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / relevantMetrics.length;
  });

  public getMetricRange = jest.fn((name: string, start: number, end: number): PerformanceMetric[] => {
    const metrics = this.getMetrics(name);
    return metrics.filter(m => m.timestamp >= start && m.timestamp <= end);
  });

  public getStatistics = jest.fn((name: string, duration: number = 60000) => {
    const metrics = this.getMetrics(name);
    const now = Date.now();
    const relevantMetrics = metrics.filter(m => m.timestamp > now - duration);

    if (relevantMetrics.length === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        count: 0,
        standardDeviation: 0,
      };
    }

    const values = relevantMetrics.map(m => m.value);
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
  });

  private notifyListeners(name: string, metric: PerformanceMetric): void {
    const listeners = this.listeners.get(name) || [];
    listeners.forEach(listener => {
      try {
        listener(metric);
      } catch (error) {
        console.error(`Error in performance listener for ${name}:`, error);
      }
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
}

export const performanceMonitor = new MockPerformanceMonitor();
