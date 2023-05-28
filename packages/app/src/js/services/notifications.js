/* eslint-disable no-console */
import { client } from '../core';

export const initNotifications = async (config) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      if (data.type) {
        client.emit(data.type, data);
      }
    });

    console.log(config);
    navigator.serviceWorker.getRegistration('/')
      .then((registration) => registration.pushManager.subscribe({
        userVisibleOnly: true,
        // eslint-disable-next-line no-undef
        applicationServerKey: config.vapidPublicKey,
      }))
      .then(async (subscription) => {
        console.log('Push subscription successful:', subscription);

        console.log(subscription.toJSON());
        return client.req({
          type: 'push:setup',
          ...subscription.toJSON(),
        });
      })
      .catch((err) => {
        console.log('Service Worker registration failed: ', err);
      });
    if ('Notification' in window) {
      document.querySelector('body').addEventListener('click', () => {
        Notification.requestPermission((status) => {
          console.log('Notification permission status:', status);
        });
      }, { once: true });
    }
  }
};
