import './registerSw';
import './sentry';
import client from './client';
import { initNotifications } from './notifications';
import { initRequests } from './requests';
import { initRequests2 } from './requests2';
import { initConfig } from './config';

window.client = client;

console.log('a');
initRequests(client);
console.log('b');
initRequests2(client);
console.log('c');
client.emit('start');
//initConfig(client);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (payload) => {
    client.emit('notification', payload);
  });
}
//initNotifications(client);

export { client };
