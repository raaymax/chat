import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export const initNotifications = (client) => {
  client.on('auth:user', subscribeNotifications);
}

async function subscribeNotifications(client) {
  if ( Capacitor.isNativePlatform() ) return initNativeNotifications();
  if ( 'serviceWorker' in navigator ) {
    await navigator.serviceWorker.ready.then(async (reg) => {
      const cfg = await client.getConfig();
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: cfg.applicationServerKey,
      }).then((subscription) => client.req({
        op: {
          type: 'setupPushNotifications',
          subscription,
        },
      // eslint-disable-next-line no-console
      })).catch((e) => console.error(e));
    });
  }
  client.emit('notifications:ready');
}

export const initNativeNotifications = (client) => {
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
