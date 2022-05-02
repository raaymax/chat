/* eslint-disable no-restricted-globals */
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// eslint-disable-next-line no-undef
const firebaseApp = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(firebaseApp);
onBackgroundMessage(messaging, async (payload) => {
  const client = await getOpenClient();
  if (client) {
    await client.postMessage(payload);
  }
})

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
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});

function getOpenClient() {
  return clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clientList) => clientList[0]);
}
