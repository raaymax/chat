/* eslint-disable no-console */
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import Sentry from './sentry';

export const initNotifications = (client) => {
  client.on('auth:user', subscribeNotifications);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (payload) => {
      client.emit('notification', payload);
    });
  }

  async function subscribeNotifications() {
    if (Capacitor.isNativePlatform()) return initNativeNotifications();
    // eslint-disable-next-line no-undef
    const app = initializeApp(FIREBASE_CONFIG);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      client.emit('notification', payload);
    });
    const cfg = client.getConfig();
    await getToken(messaging, { vapidKey: cfg.applicationServerKey }).then((currentToken) => {
      console.log(currentToken)
      if (currentToken) {
        return client.req({
          type: 'setupFcm',
          token: currentToken,
        });
      }
      console.log('No registration token available. Request permission to generate one.');
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      Sentry.captureException(err);
    });
    client.emit('notifications:ready');
  }

  const initNativeNotifications = () => {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', async (token) => {
      try {
        await client.req({
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
};
