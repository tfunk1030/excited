import { MemorySnapshot, MemoryProfile, MemoryLeak } from '../../memoryProfiler';

// Mock memory values
let mockHeapUsed = 1024 * 1024; // 1MB
let mockHeapTotal = 1024 * 1024 * 10; // 10MB
let mockExternal = 0;
let mockArrayBuffers = 0;

// Mock memory growth
const MOCK_GROWTH_RATE = 0.1; // 10% growth per snapshot
const MOCK_LEAK_SIZE = 1024 * 1024; // 1MB leak

export const mockMemoryInfo = {
  setHeapUsed: (value: number) => mockHeapUsed = value,
  setHeapTotal: (value: number) => mockHeapTotal = value,
  setExternal: (value: number) => mockExternal = value,
  setArrayBuffers: (value: number) => mockArrayBuffers = value,
  simulateGrowth: () => {
    mockHeapUsed *= (1 + MOCK_GROWTH_RATE);
  },
  simulateLeak: () => {
    mockHeapUsed += MOCK_LEAK_SIZE;
  },
  reset: () => {
    mockHeapUsed = 1024 * 1024;
    mockHeapTotal = 1024 * 1024 * 10;
    mockExternal = 0;
    mockArrayBuffers = 0;
  },
};

// Mock process.memoryUsage
(global as any).process = {
  ...(global as any).process,
  memoryUsage: () => ({
    heapUsed: mockHeapUsed,
    heapTotal: mockHeapTotal,
    external: mockExternal,
    arrayBuffers: mockArrayBuffers,
  }),
};

// Mock window.performance.memory
if (typeof window !== 'undefined') {
  Object.defineProperty(window.performance, 'memory', {
    value: {
      get usedJSHeapSize() { return mockHeapUsed; },
      get totalJSHeapSize() { return mockHeapTotal; },
      get jsHeapSizeLimit() { return mockHeapTotal * 2; },
    },
    configurable: true,
  });
}

// Mock Error.captureStackTrace
Error.captureStackTrace = function(targetObject: Error) {
  targetObject.stack = `
    Error: Stack trace
        at createLeak (memoryProfiler.test.ts:123:456)
        at Object.<anonymous> (memoryProfiler.test.ts:789:012)
        at Object.asyncJestTest (jest-jasmine2:134:345)
  `;
};

// Mock Date.now for consistent timestamps
const START_TIME = 1600000000000; // Fixed start time
let currentTime = START_TIME;

const originalDateNow = Date.now;
Date.now = jest.fn(() => currentTime);

export const mockTime = {
  advance: (ms: number) => {
    currentTime += ms;
  },
  reset: () => {
    currentTime = START_TIME;
  },
  restore: () => {
    Date.now = originalDateNow;
  },
};

// Mock setInterval for snapshot timing
interface MockInterval {
  callback: () => void;
  ms: number;
}

const mockIntervals = new Map<number, MockInterval>();
let nextIntervalId = 1;

// Store original timer functions
const originalSetInterval = global.setInterval;
const originalClearInterval = global.clearInterval;

// Create mock timer functions with proper types
function createMockTimeout(id: number): NodeJS.Timeout {
  return {
    hasRef: () => true,
    ref: function(this: NodeJS.Timeout) { return this; },
    refresh: function(this: NodeJS.Timeout) { return this; },
    unref: function(this: NodeJS.Timeout) { return this; },
    [Symbol.toPrimitive]: () => id,
  } as NodeJS.Timeout;
}

// Override timer functions with proper typing
const mockedSetInterval = jest.fn((callback: () => void, ms?: number) => {
  const id = nextIntervalId++;
  mockIntervals.set(id, { callback, ms: ms || 0 });
  return createMockTimeout(id);
});

const mockedClearInterval = jest.fn((intervalId?: NodeJS.Timeout | null) => {
  if (!intervalId) return;
  const id = Number(intervalId);
  mockIntervals.delete(id);
});

// Replace global timer functions
global.setInterval = mockedSetInterval as unknown as typeof global.setInterval;
global.clearInterval = mockedClearInterval as unknown as typeof global.clearInterval;

export const mockIntervalControl = {
  triggerAll: () => {
    mockIntervals.forEach(interval => {
      interval.callback();
    });
  },
  clear: () => {
    mockIntervals.clear();
    nextIntervalId = 1;
  },
  getIntervals: () => Array.from(mockIntervals.entries()),
  restore: () => {
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
    mockIntervals.clear();
    nextIntervalId = 1;
  },
};

// Helper function to create a mock memory snapshot
export function createMockSnapshot(
  heapUsed: number = mockHeapUsed,
  timestamp: number = Date.now()
): MemorySnapshot {
  return {
    timestamp,
    heapUsed,
    heapTotal: mockHeapTotal,
    external: mockExternal,
    arrayBuffers: mockArrayBuffers,
  };
}

// Helper function to create a mock memory leak
export function createMockLeak(
  size: number = MOCK_LEAK_SIZE,
  type: string = 'Heap Growth'
): MemoryLeak {
  return {
    type,
    size,
    count: 1,
    trace: [
      'at createLeak (memoryProfiler.test.ts:123:456)',
      'at Object.<anonymous> (memoryProfiler.test.ts:789:012)',
    ],
  };
}

// Helper function to create a mock memory profile
export function createMockProfile(
  snapshots: MemorySnapshot[] = [],
  leaks: MemoryLeak[] = []
): MemoryProfile {
  const usage = snapshots.map(s => s.heapUsed);
  const averageUsage = usage.reduce((a, b) => a + b, 0) / usage.length || 0;
  const peakUsage = Math.max(...usage, 0);

  return {
    snapshots,
    leaks,
    timeline: snapshots.map((s, i) => ({
      timestamp: s.timestamp,
      event: i === 0 ? 'Profile Start' : i === snapshots.length - 1 ? 'Profile End' : '',
      memoryDelta: i === 0 ? 0 : s.heapUsed - snapshots[i - 1].heapUsed,
    })),
    summary: {
      averageUsage,
      peakUsage,
      leakScore: leaks.length > 0 ? 50 : 0,
      recommendations: leaks.length > 0 
        ? ['Memory leaks detected. Check event listeners and cache cleanup.']
        : ['Memory usage appears normal. Continue monitoring for changes.'],
    },
  };
}

// Export all mock controls
export const mockControls = {
  memory: mockMemoryInfo,
  time: mockTime,
  intervals: mockIntervalControl,
  createSnapshot: createMockSnapshot,
  createLeak: createMockLeak,
  createProfile: createMockProfile,
};

// Cleanup function for tests
afterEach(() => {
  mockControls.memory.reset();
  mockControls.time.reset();
  mockControls.intervals.clear();
});
