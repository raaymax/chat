import { WebSocketTransport } from './transport';
import { SequenceMessage, ResponseMessage, RequestMessage } from './types';
import { Event } from './event';
import { Message } from './message';

export class Request extends Message {
  static send = async (msg: RequestMessage, transport: WebSocketTransport) => (new Request(msg, transport)).send();

  data: SequenceMessage[] = [];
  
  res: ResponseMessage = null

  addPart(msg: SequenceMessage) {
    this.data.push(msg);
  }

  processSequnce(msg: SequenceMessage, ev: Event) {
    ev.preventDefault();
    this.addPart(msg);
  }
}
