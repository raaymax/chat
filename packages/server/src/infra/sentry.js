const Sentry = require('@sentry/node');
const config = require('../../../../chat.config');
const pack = require('../../package.json');

Sentry.init({
  dsn: config.sentryDns,
  environment: process.env.NODE_ENV,
  release: `server@${pack.version}`,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
Sentry.setTag('package', `server@${pack.version}`);
