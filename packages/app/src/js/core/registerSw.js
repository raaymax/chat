/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    type: 'module',
    scope: '/',
  })
    .catch((err) => {
      console.log('Service Worker registration failed: ', err);
    });
}
