
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).then((reg) => {
    console.log('SW zarejestrowany! Scope:', reg.scope );
  }).catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });


  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission(function(status) {
      console.log('Notification permission status:', status);
    });
  }
}

(async () => {
  window.EMOJI = []
  const res = await fetch('/assets/emoji_list.json');
  window.EMOJI = await res.json();
})();
