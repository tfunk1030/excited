import * as Sentry from '@sentry/react-native';

export const ErrorTracking = {
  logError: (error: Error, context?: Record<string, any>) => {
    Sentry.captureException(error, {
      extra: context,
    });
  },

  logMessage: (message: string, level: Sentry.SeverityLevel = 'info') => {
    Sentry.captureMessage(message, {
      level,
    });
  },

  setUser: (userId: string | null, data?: Record<string, any>) => {
    Sentry.setUser(userId ? {
      id: userId,
      ...data,
    } : null);
  },

  setTag: (key: string, value: string) => {
    Sentry.setTag(key, value);
  },

  startTransaction: (name: string, operation: string) => {
    return Sentry.startTransaction({
      name,
      op: operation,
    });
  },

  startSpan: (transaction: Sentry.Transaction, name: string, options?: Sentry.SpanOptions) => {
    return transaction.startChild({
      op: name,
      ...options,
    });
  },

  wrapWithTransaction: async <T>(
    name: string,
    operation: string,
    callback: (transaction: Sentry.Transaction) => Promise<T>
  ): Promise<T> => {
    const transaction = Sentry.startTransaction({
      name,
      op: operation,
    });

    try {
      const result = await callback(transaction);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      Sentry.captureException(error);
      throw error;
    } finally {
      transaction.finish();
    }
  },

  // Utility for tracing API calls
  traceApiCall: async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    return ErrorTracking.wrapWithTransaction(
      `API: ${options.method || 'GET'} ${url}`,
      'http.client',
      async (transaction) => {
        const response = await fetch(url, options);
        const data = await response.json();
        return data as T;
      }
    );
  },
}; 