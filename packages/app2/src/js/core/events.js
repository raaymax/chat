import Sentry from './sentry';

export const createEventListener = () => {
  const handlers = {};
  const notify = (ev, ...args) => Promise.all(
    (handlers[ev] || [])
      .map(async (listener) => {
        try {
          await listener(...args);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          Sentry.captureException(err);
        }
      }),
  );
  // eslint-disable-next-line no-return-assign
  const watch = (ev, fn) => (handlers[ev] = handlers[ev] || []).push(fn);

  const exists = (ev) => Array.isArray(handlers[ev]) && handlers[ev].length > 0;

  return { watch, notify, exists };
};
