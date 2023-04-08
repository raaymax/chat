/* eslint-disable no-restricted-globals */
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// eslint-disable-next-line no-undef
self.addEventListener('notificationclick', (event) => {
  // eslint-disable-next-line no-console
  console.log('click', event);
  event.notification.close();

  event.waitUntil(clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clientList) => {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if ('focus' in client) {
        client.postMessage({type: 'notification:click', ...event.notification.data.FCM_MSG.data});
        return client.focus(); // FIXME: redirect to proper message or channel
      }
    }
    if (clients.openWindow) {
      const a = event.notification.data.FCM_MSG.data;
      const query = new URLSearchParams({
        date: a.createdAt,
        selected: a.messageId,
      });
      return clients.openWindow(`/#/${a.channelId}${a.parentId ? `/${a.parentId}` : ''}?${query.toString()}`);
    }
  }));
});

function getOpenClient() {
  return clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clientList) => clientList[0]);
}

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(firebaseApp);
onBackgroundMessage(messaging, async (payload) => {
  const client = await getOpenClient();
  if (client) {
    await client.postMessage({type: 'notification', ...payload});
  }
});
