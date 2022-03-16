const EXTERNAL_ASSETS = [
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.js',
  'https://cdn.quilljs.com/1.3.6/quill.js',
  'https://cdn.quilljs.com/1.3.6/quill.snow.css',
  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.css',
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
]
const ASSETS = [
  '/style.css',
  '/index.html',
  '/assets/favicon.ico',
  '/assets/fontawesome/css/all.css',
  '/'
]
self.addEventListener('install', event => {
  async function onInstall() {
    const cache = await caches.open('static');
    await cache.addAll(ASSETS);
    await cache.addAll(EXTERNAL_ASSETS);
  }
  event.waitUntil(onInstall(event));
});


self.addEventListener('fetch', (event) => {
  if(EXTERNAL_ASSETS.includes(event.request.url)){
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(event.request)
        }
      )
    )
  }else{
    event.respondWith(fetch(event.request));
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(async () => {
    await Promise.all(ASSETS.map(asset => cache.delete(asset)))
  })
})
