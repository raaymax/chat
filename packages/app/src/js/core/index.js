import { WebSocketTransport, Request, Notification} from '@quack/rpc';
import './registerSw';
import './sentry';

const URI = `${document.location.protocol}//${document.location.host}`;

const client = new WebSocketTransport(URI);

window.client = client;

client.req = (msg) => Request.send(msg, client);
client.notif = (msg) => Notification.send(msg, client);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', ({data}) => {
    if(data.type){
      client.emit(data.type, data);
    }
  });
}

export { client };
