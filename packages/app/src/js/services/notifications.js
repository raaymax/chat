/* eslint-disable no-console */
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import Sentry from '../core/sentry';
import { client } from '../core';

export const initNotifications = async (config) => {
  if (Capacitor.isNativePlatform()) {
    await initNativeNotifications(config);
  } else {
    await initWebNotifications(config);
  }
}

const initWebNotifications = async (config) => {
  try {
    // eslint-disable-next-line no-undef
    const app = initializeApp(FIREBASE_CONFIG);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      client.emit('notification', payload);
    });
    const currentToken = await getToken(messaging, { vapidKey: config.applicationServerKey });
    if (currentToken) {
      await client.req2({
        type: 'setupFcm',
        token: currentToken,
      });
    }
  } catch (err) {
    Sentry.captureException(err);
    console.log('An error occurred while retrieving token. ', err);
  }
}

const initNativeNotifications = () => {
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === 'granted') {
      PushNotifications.register();
    }
  });

  PushNotifications.addListener('registration', async (token) => {
    try {
      await client.req2({
        type: 'setupFcm',
        token: token.value,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      Sentry.captureException(err);
    }
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.log('error', JSON.stringify(error, null, 4));
    Sentry.captureException(error);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('notif', JSON.stringify(notification, null, 4));
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('notifaction', JSON.stringify(notification, null, 4));
  });
};
