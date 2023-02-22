const EXTERNAL_ASSETS = [
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.js',
  'https://cdn.quilljs.com/1.3.6/quill.js',
  'https://cdn.quilljs.com/1.3.6/quill.snow.css',
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.css',
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
];

const ASSETS = [
  '/vendors-node_modules_reduxjs_toolkit_dist_redux-toolkit_esm_js-node_modules_firebase_app_dist-9bcf40.js',
  '/index.html',
  '/secured.js',
  '/15d98c18221c8bcb2334.ttf',
  '/52eba2c567c521b8d58a.ttf',
  '/firebase-messaging-sw.js',
  '/app.css',
  '/79da213423ac0def2058.ttf',
  '/src_js_pages_secured_js.js',
  '/4896d4b04430cc3dfb06.woff2',
  '/3d503f89ccaf1b224aa5.woff2',
  '/0a1b701f5563c2288281.ttf',
  '/manifest.json',
  '/f77bcc98bb7468c8b15a.woff2',
  '/d79c2ec96ab9ff1161a2.woff2',
  '/assets/icon.png',
  '/assets/bob.png',
  '/assets/favicon.ico',
  '/assets/openai.png',
  '/assets/fontawesome/css/all.css',
  '/assets/fontawesome/css/all.min.css',
  '/assets/fontawesome/webfonts/fa-solid-900.ttf',
  '/assets/fontawesome/webfonts/fa-regular-400.woff2',
  '/assets/fontawesome/webfonts/fa-v4compatibility.ttf',
  '/assets/fontawesome/webfonts/fa-regular-400.ttf',
  '/assets/fontawesome/webfonts/fa-v4compatibility.woff2',
  '/assets/fontawesome/webfonts/fa-solid-900.woff2',
  '/assets/fontawesome/webfonts/fa-brands-400.woff2',
  '/assets/fontawesome/webfonts/fa-brands-400.ttf',
  '/assets/emoji_list.json',
  '/assets/sound.mp3',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/icons/mstile-150x150.png',
  '/assets/icons/favicon-32x32.png',
  '/app.js',
  '/sw.js',
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
  if (event.request.method === 'PUT') {
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
