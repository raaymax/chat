import { WebSocketTransport, Request, Notification } from '@quack/rpc';
import './registerSw';

const client = new WebSocketTransport();

window.client = client;

client.req = (msg) => Request.send(msg, client);
client.notif = (msg) => Notification.send(msg, client);

export { client };
