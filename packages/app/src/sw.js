import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import * as navigationPreload from 'workbox-navigation-preload';
precacheAndRoute(self.__WB_MANIFEST);

navigationPreload.enable();

registerRoute(
  '/share',
  shareTargetHandler,
  'POST'
);

async function shareTargetHandler ({event}) {
  getOpenClient().then((client) => {
    if (client) {
      event.request.formData().then((formData) => {
        const data = {}
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, val] of formData.entries()) {
          data[key] = val;
        }
        client.postMessage({type: 'share', data});
      });
    }
  });
  event.respondWith(Response.redirect('https://chat.codecat.io/'));
};



function getOpenClient() {
  return clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clientList) => clientList[0]);
}

