/* eslint-disable no-console */
import { PushNotifications } from '@capacitor/push-notifications';
import {client} from '../core';

export const initNotifications = () => {
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
