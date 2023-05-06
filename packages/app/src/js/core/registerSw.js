/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  })
    .catch((err) => {
      console.log('Service Worker registration failed: ', err);
    });
}
