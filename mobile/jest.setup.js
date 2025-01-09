import '@testing-library/jest-native/extend-expect';

// Mock timers
jest.useFakeTimers();

// Mock performance monitor
jest.mock('./src/utils/performanceMonitor');

// Mock memory profiler
jest.mock('./src/utils/memoryProfiler');

// Mock React Native's Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
}));

// Mock Date.now() for consistent timestamps in tests
const NOW = 1672531200000; // 2023-01-01T00:00:00.000Z
global.Date.now = jest.fn(() => NOW);

// Mock console methods to prevent noise in test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Please update the following components') ||
      args[0].includes('React.createFactory()') ||
      args[0].includes('async-validator:') ||
      args[0].includes('componentWillReceiveProps') ||
      args[0].includes('componentWillMount'))
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('componentWillMount') ||
      args[0].includes('componentWillReceiveProps'))
  ) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

console.log = (...args) => {
  if (process.env.JEST_VERBOSE_LOGS) {
    originalConsoleLog.call(console, ...args);
  }
};

// Mock global performance object
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
