const EXTERNAL_ASSETS = [
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.js',
  'https://cdn.quilljs.com/1.3.6/quill.js',
  'https://cdn.quilljs.com/1.3.6/quill.snow.css',
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.css',
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
];

const ASSETS = [
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/mstile-150x150.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/emoji_list.json',
  '/assets/favicon.ico',
  '/assets/fontawesome/webfonts/fa-v4compatibility.ttf',
  '/assets/fontawesome/webfonts/fa-brands-400.woff2',
  '/assets/fontawesome/webfonts/fa-solid-900.ttf',
  '/assets/fontawesome/webfonts/fa-regular-400.ttf',
  '/assets/fontawesome/webfonts/fa-solid-900.woff2',
  '/assets/fontawesome/webfonts/fa-regular-400.woff2',
  '/assets/fontawesome/webfonts/fa-brands-400.ttf',
  '/assets/fontawesome/webfonts/fa-v4compatibility.woff2',
  '/assets/fontawesome/css/all.css',
  '/assets/fontawesome/css/all.min.css',
  '/manifest.json',
  '/sw.js',
  '/index.css',
  '/index.html',
  '/index.js',
  '/',
];

self.addEventListener('install', (event) => {
  async function onInstall() {
    const cache = await caches.open('static');
    await cache.addAll(ASSETS);
    await cache.addAll(EXTERNAL_ASSETS);
  }
  event.waitUntil(onInstall(event));
});

self.addEventListener('fetch', (event) => {
  if (EXTERNAL_ASSETS.includes(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }),
    );
  } else if (ASSETS.includes(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request)),
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(async () => {
    await Promise.all(ASSETS.map((asset) => cache.delete(asset)));
  });
});

self.addEventListener('push', (e) => {
  // eslint-disable-next-line no-console
  console.log('[SW] notification', e);
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.description,
      tag: data.channel,
      vibrate: [100, 50, 100],
      silent: false,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
      actions: [
        { action: 'open', title: 'Go to message' },
      ],
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  // eslint-disable-next-line no-console
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  event.waitUntil(clients.matchAll({
    type: 'window',
  }).then((clientList) => {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url === '/' && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('/');
  }));
});
