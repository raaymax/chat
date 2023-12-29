/* eslint-disable no-console */
import { client } from '../core';

export const initNotifications = async (config) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      if (data.type) {
        client.emit(data.type, data);
      }
    });

    await register(config);
    if ('Notification' in window) {
      document.querySelector('body').addEventListener('click', () => {
        Notification.requestPermission((status) => {
          console.log('Notification permission status:', status);
        });
      }, { once: true });
    }
  }
};

const register = async (config, retry = false) => navigator.serviceWorker.getRegistration('/')
  .then((registration) => registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: config.vapidPublicKey,
  }))
  .then(async (subscription) => client.req({
    type: 'user:push:subscribe',
    ...subscription.toJSON(),
  }))
  .then(() => console.log('Notifications service worker registered successfully'))
  .catch((err) => {
    console.log('Service Worker registration failed: ', err);
    if (retry) return;
    navigator.serviceWorker.getRegistration('/')
      .then((registration) => registration.pushManager.getSubscription())
      .then((sub) => sub && sub.unsubscribe())
      .then(() => register(config, true));
  });
