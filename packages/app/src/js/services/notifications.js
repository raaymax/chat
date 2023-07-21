/* eslint-disable no-console */
import { client } from '../core';

export const initNotifications = async (config) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      if (data.type) {
        client.emit(data.type, data);
      }
    });

    navigator.serviceWorker.getRegistration('/')
      .then((registration) => registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: config.vapidPublicKey,
      }))
      .then((subscription) => client.req({
        type: 'push:setup',
        ...subscription.toJSON(),
      }))
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
