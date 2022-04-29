/* eslint-disable no-console */
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import firebaseConfig from '../../firebaseConfig';

export const initNotifications = (client) => {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  client.on('auth:user', subscribeNotifications);

  onMessage(messaging, (payload) => {
    client.emit('notification', payload);
  });

  if ( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.addEventListener('message', (payload) => {
      client.emit('notification', payload);
    });
  }

  async function subscribeNotifications(client) {
    if ( Capacitor.isNativePlatform() ) return initNativeNotifications(client);
    const cfg = client.getConfig();
    await getToken(messaging, { vapidKey: cfg.applicationServerKey }).then((currentToken) => {
      if (currentToken) {
        return client.req({
          op: {
            type: 'setupFcm',
            fcmToken: currentToken,
          },
        })
      }
      console.log('No registration token available. Request permission to generate one.');
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
    client.emit('notifications:ready');
  }

  const initNativeNotifications = (client) => {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', async (token) => {
      try {
        await client.req({
          op: {
            type: 'setupFcm',
            fcmToken: token.value,
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.log('error', JSON.stringify(error, null, 4));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('notif', JSON.stringify(notification, null, 4));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('notifaction', JSON.stringify(notification, null, 4));
    });
  };
}
