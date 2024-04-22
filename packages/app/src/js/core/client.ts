import { WebSocketTransport, Request, Notification } from './rpc';
import { OutgoingPayload } from './types';

declare global {
  const API_URL: string;
}

export class Client extends WebSocketTransport {
  req = (msg: OutgoingPayload): any => Request.send(msg, this);
  notif = (msg: OutgoingPayload): any => Notification.send(msg, this);
  send = (msg: OutgoingPayload): any => super.send(msg);
}
export const client = new Client(API_URL, localStorage.token);
