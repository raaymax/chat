import { WebSocketTransport, Request, Notification } from '@quack/rpc';
import './registerSw';

console.log('client token', localStorage.token);
const client = new WebSocketTransport(API_URL, localStorage.token);

window.client = client;

client.req = (msg) => Request.send(msg, client);
client.notif = (msg) => Notification.send(msg, client);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    client.emit('win.visible');
  }
});

export { client };
