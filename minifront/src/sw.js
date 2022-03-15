const ASSETS = [
  '/app.js',
  '/style.css',
  '/index.html',
  '/assets/favicon.ico',
  '/'
]
self.addEventListener('install', event => {
  async function onInstall() {
    const cache = await caches.open('static');
    return await cache.addAll(ASSETS);
  }
  event.waitUntil(onInstall(event));
});



self.addEventListener('fetch', (event) => {
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
})

self.addEventListener('activate', (event) => {
  event.waitUntil(async () => {
    await Promise.all(ASSETS.map(asset => cache.delete(asset)))
  })
})
