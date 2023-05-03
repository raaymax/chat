/* eslint-disable no-console */
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { client } from '../core';

export const initNotifications = async (config) => {
  try {
    // eslint-disable-next-line no-undef
    const app = initializeApp(FIREBASE_CONFIG);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      client.emit('notification', payload);
    });
    const currentToken = await getToken(messaging, { vapidKey: config.applicationServerKey });
    if (currentToken) {
      await client.req({
        type: 'fcm:setup',
        token: currentToken,
      });
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
}
