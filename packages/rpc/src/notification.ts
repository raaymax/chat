import { WebSocketTransport } from './transport';
import { RequestMessage } from './types';
import { Message } from './message';

export class Notification {
  static send = async (msg: RequestMessage, transport: WebSocketTransport) => (new Message(msg, transport)).send();
}
