/* eslint-disable no-restricted-syntax */
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import * as navigationPreload from 'workbox-navigation-preload';

precacheAndRoute(self.__WB_MANIFEST);

navigationPreload.enable();

registerRoute(
  '/share',
  shareTargetHandler,
  'POST',
);

async function shareTargetHandler ({event}) {
  getOpenClient().then((client) => {
    if (client) {
      event.request.formData().then((formData) => {
        const data = {}
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, val] of formData.entries()) {
          data[key] = val;
        }
        client.postMessage({type: 'share', data});
      });
    }
  });
  event.respondWith(Response.redirect('/'));
}

function getOpenClient() {
  return clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clientList) => clientList[0]);
}

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const title = data.title || 'New Notification';
    const options = {
      body: data.body || 'You have a new notification.',
      icon: data.icon || '/icon.png',
      badge: data.badge || '/badge.png',
      silent: false,
      vibrate: [100, 50, 100],
      tag: 'notif',
      data: {
        ...data,
        url: data.url || '/',
      },
    };

    event.waitUntil(handleNotification(title, options, data));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(handleNotificationClick(event));
});

async function handleNotificationClick(event) {
  const link = event.notification.data.url;
  if (!link) return;
  const url = new URL(link, self.location.href);
  const originUrl = new URL(self.location.origin);
  if (url.host !== originUrl.host) {
    return;
  }
  let client = await getWindowClient(url);
  if (!client) {
    client = await self.clients.openWindow(link);
    await wait(3210);
  } else {
    client = await client.focus();
  }
  if (!client) return;
  return client.postMessage({type: 'notification:click', ...event.notification.data});
}

async function handleNotification(title, options, data) {
  await self.registration.showNotification(title, options);
  const clientList = await getClientList();
  if (hasVisibleClients(clientList)) {
    for (const client of clientList) {
      client.postMessage({type: 'notification', data});
    }
  }
}

function getClientList() {
  return self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
}

function hasVisibleClients(clientList) {
  return clientList.some((client) => client.visibilityState === 'visible'
    && !client.url.startsWith('chrome-extension://'));
}

async function getWindowClient(url) {
  const clientList = await getClientList();
  for (const client of clientList) {
    const clientUrl = new URL(client.url, self.location.href);
    if (url.host === clientUrl.host) {
      return client;
    }
  }
  return null;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
