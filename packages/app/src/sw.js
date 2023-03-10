import {precacheAndRoute} from 'workbox-precaching';

const EXTERNAL_ASSETS = [
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.js',
  'https://cdn.quilljs.com/1.3.6/quill.js',
  'https://cdn.quilljs.com/1.3.6/quill.snow.css',
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.css',
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
];

self.addEventListener('install', (event) => {
  console.log('install');
  async function onInstall() {
    const cache = await caches.open('static');
    await cache.addAll(EXTERNAL_ASSETS);
  }
  event.waitUntil(onInstall(event));
});

console.log('start');
self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('/share/')) {
    getOpenClient().then((client) => {
      if (client) {
        event.request.formData().then((formData) => {
          const data = {}
          for (const pair of formData.entries()) {
              data[pair[0]] = pair[1];
          }
          client.postMessage({type: 'share', data});
        });
      }
    });
    event.respondWith(new Response('// no-op'));
    return;
  }
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
  } 
});

self.addEventListener('activate', (event) => {
  console.log('activate');
  //return self.clients.claim();
});

function getOpenClient() {
  return clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clientList) => clientList[0]);
}

precacheAndRoute(self.__WB_MANIFEST);
