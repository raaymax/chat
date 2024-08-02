import { WebSocketTransport, Request, Notification, HttpTransport } from './rpc';
import { OutgoingPayload } from './types';

declare global {
  const API_URL: string;
}



export class ClientOld extends WebSocketTransport {
  get token(): string {
    return localStorage.token
  }

  req = (msg: OutgoingPayload): any => Request.send(msg, this);

  notif = (msg: OutgoingPayload): any => Notification.send(msg, this);

  send = (msg: OutgoingPayload): any => super.send(msg);
}

export class Client extends HttpTransport {
  get token(): string {
    return localStorage.token
  }
}

export const client = new Client(API_URL, localStorage.token);
