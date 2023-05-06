import { WebSocketTransport, Request, Notification} from '@quack/rpc';
import './registerSw';

const URI = `${document.location.protocol}//${document.location.host}`;

const client = new WebSocketTransport(URI);

window.client = client;

client.req = (msg) => Request.send(msg, client);
client.notif = (msg) => Notification.send(msg, client);

export { client };
