/* eslint-disable no-undef */
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";
import * as SentryCapacitor from "@sentry/capacitor";
import { Capacitor } from '@capacitor/core';

export default (() => {
  if (Capacitor.isNativePlatform() ) {
    SentryCapacitor.init({
      dsn: SENTRY_DNS,
      release: `android@${APP_VERSION}`,
      dist: "1",
      tracesSampleRate: 1.0,
      integrations: [new BrowserTracing({})],
    });
    SentryCapacitor.setTag('package', `${APP_NAME}-android@${APP_VERSION}`);
    return SentryCapacitor;
  }
  Sentry.init({
    dsn: window.SENTRY_DNS,
    release: `web@${APP_VERSION}`,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
  Sentry.setTag('package', `${APP_NAME}@${APP_VERSION}`);
  return Sentry;
})();
