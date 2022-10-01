import './registerSw';
import './sentry';
import client from './client';
import { initRequests } from './requests';
import { initRequests2 } from './requests2';

window.client = client;

initRequests(client);
initRequests2(client);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (payload) => {
    client.emit('notification', payload);
  });
}

export { client };
