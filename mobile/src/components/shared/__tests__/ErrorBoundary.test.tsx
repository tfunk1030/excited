import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorBoundary, { withErrorBoundary } from '../ErrorBoundary';
import { performanceMonitor } from '../../../utils/performanceMonitor';

// Mock dependencies
jest.mock('../../../utils/performanceMonitor');

// Test components
const ErrorComponent = () => {
  throw new Error('Test error');
};

const SafeComponent = () => <></>;

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Error Handling', () => {
    it('should render children when no error occurs', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(() => getByText('Something went wrong')).toThrow();
    });

    it('should render error UI when error occurs', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText('Test error')).toBeTruthy();
    });

    it('should render custom fallback when provided', () => {
      const fallback = <SafeComponent />;
      const { getByText } = render(
        <ErrorBoundary fallback={fallback}>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(() => getByText('Something went wrong')).toThrow();
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should call onError when error occurs', () => {
      const onError = jest.fn();
      render(
        <ErrorBoundary onError={onError}>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should record error metric when error occurs', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'error_boundary_catch',
        1,
        expect.any(Object)
      );
    });

    it('should reset error state when Try Again is pressed', () => {
      const onReset = jest.fn();
      const { getByText, queryByText } = render(
        <ErrorBoundary onReset={onReset}>
          <ErrorComponent />
        </ErrorBoundary>
      );

      const tryAgainButton = getByText('Try Again');
      fireEvent.press(tryAgainButton);

      expect(onReset).toHaveBeenCalled();
      // Error message should still be visible since the component will error again
      expect(queryByText('Something went wrong')).toBeTruthy();
    });
  });

  describe('withErrorBoundary HOC', () => {
    it('should wrap component with error boundary', () => {
      const WrappedError = withErrorBoundary(ErrorComponent);
      const { getByText } = render(<WrappedError />);

      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should pass error boundary props', () => {
      const onError = jest.fn();
      const WrappedError = withErrorBoundary(ErrorComponent, {
        onError,
      });
      render(<WrappedError />);

      expect(onError).toHaveBeenCalled();
    });

    it('should pass component props through', () => {
      interface TestProps {
        testProp: string;
      }
      const TestComponent: React.FC<TestProps> = ({ testProp }) => (
        <>{testProp}</>
      );
      const WrappedComponent = withErrorBoundary(TestComponent);
      const { getByText } = render(
        <WrappedComponent testProp="test value" />
      );

      expect(getByText('test value')).toBeTruthy();
    });
  });

  describe('Multiple Errors', () => {
    it('should handle multiple errors in sequence', () => {
      const onError = jest.fn();
      const { getByText } = render(
        <ErrorBoundary onError={onError}>
          <ErrorComponent />
        </ErrorBoundary>
      );

      // First error
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(onError).toHaveBeenCalledTimes(1);

      // Reset and trigger second error
      fireEvent.press(getByText('Try Again'));
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(onError).toHaveBeenCalledTimes(2);
    });

    it('should handle nested error boundaries', () => {
      const outerOnError = jest.fn();
      const innerOnError = jest.fn();

      render(
        <ErrorBoundary onError={outerOnError}>
          <SafeComponent />
          <ErrorBoundary onError={innerOnError}>
            <ErrorComponent />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      expect(innerOnError).toHaveBeenCalledTimes(1);
      expect(outerOnError).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined error message', () => {
      const UndefinedErrorComponent = () => {
        throw new Error();
      };

      const { getByText } = render(
        <ErrorBoundary>
          <UndefinedErrorComponent />
        </ErrorBoundary>
      );

      expect(getByText('An unexpected error occurred')).toBeTruthy();
    });

    it('should handle non-Error throws', () => {
      const StringErrorComponent = () => {
        throw 'String error'; // eslint-disable-line no-throw-literal
      };

      const { getByText } = render(
        <ErrorBoundary>
          <StringErrorComponent />
        </ErrorBoundary>
      );

      expect(getByText('An unexpected error occurred')).toBeTruthy();
    });
  });
});
