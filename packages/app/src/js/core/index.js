import { WebSocketTransport, Request} from '@quack/rpc';
import './registerSw';
import './sentry';
import { initRequests } from './requests';

const URI = `${document.location.protocol}//${document.location.host}`;

const client = new WebSocketTransport(URI);

window.client = client;

client.req2 = (msg) => Request.send(msg, client);

initRequests(client);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (payload) => {
    client.emit('notification', payload);
  });
}

navigator.serviceWorker.addEventListener("message", (event) => {
  console.log(event.data.msg, event.data.url);
});

export { client };
