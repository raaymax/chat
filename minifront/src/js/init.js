import {emojiPromise } from '/js/emoji.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).then((reg) => {
    reg.pushManager.getSubscription().then(function(sub) {
      if (sub === null) {
        console.log('Not subscribed to push service!');
      } else {
        console.log('Subscription object: ', sub);
      }
    });
    console.log('SW zarejestrowany! Scope:', reg.scope );
  })
  .catch(function(err) {
    console.log('Service Worker registration failed: ', err);
  });


  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission(function(status) {
      console.log('Notification permission status:', status);
    });
  }
}


function displayNotification() {
  console.log(Notification.permission);
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(async function(reg) {
      try{ 
        console.log('showing notification');
        await reg.showNotification('Hello world!', {
          body: 'Here is a notification body!',
          icon: '/assets/icons/android-chrome-512x512.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
        });
        console.log('success');
      }catch(err){
        console.error(err);
      }
    });
  }
}

(async () => {
  window.EMOJI = []
  window.EMOJI = await emojiPromise;
})()
