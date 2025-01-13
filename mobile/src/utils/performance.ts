import * as Sentry from '@sentry/react-native';

export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

export function wrapApiCall<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const transaction = startTransaction(name, 'http.client');
  const span = transaction.startChild({
    op: 'http.request',
    description: `API call: ${name}`,
  });

  return fn()
    .then((result) => {
      span.setStatus('ok');
      return result;
    })
    .catch((error) => {
      span.setStatus('error');
      throw error;
    })
    .finally(() => {
      span.finish();
      transaction.finish();
    });
}

// Example usage:
// const data = await wrapApiCall('fetchUserProfile', () => api.getUserProfile(userId)); 