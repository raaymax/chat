/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  }).then((reg) => {
    console.log('SW zarejestrowany! Scope:', reg.scope);
  }).catch((err) => {
    console.log('Service Worker registration failed: ', err);
  });

  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission((status) => {
      console.log('Notification permission status:', status);
    });
  }
}
