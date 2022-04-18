import { PushNotifications } from '@capacitor/push-notifications';
import client from '../client';

export const initNotifications = () => {
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === 'granted') {
      PushNotifications.register();
    }
  });

  PushNotifications.addListener('registration', async (token) => {
    console.log('Register FCM');
    try {
      await client.req({
        op: {
          type: 'setupFcm',
          fcmToken: token.value,
        },
      });
      console.log('Register FCM - done');
    } catch(err) {
      console.log('Register FCM - error');
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
