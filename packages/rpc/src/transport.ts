import { Socket, Manager } from 'socket.io-client';
import { createEventListener } from './utils';
import {
  Message, SequenceMessage, isMessage, isSequenceMessage,
} from './types';
import { Event } from './event';

export interface Transport {
  send: (data: Message) => void;
  onSeq: (seqId: string, callback: (data: Message) => void) => void;
  offSeq: (seqId: string) => void;
  on: (event: string, callback: (data: Message) => void) => void;
  once: (event: string, callback: (data: Message) => void) => void;
  off: (event: string, callback: (data: Message) => void) => void;
}

export class WebSocketTransport implements Transport {
  private bus = createEventListener<Message>();

  private seqHandlers = createEventListener<SequenceMessage>();

  private socket: Socket;

  private manager: Manager;

  constructor(url: string, token: string) {
    this.manager = new Manager(url);
    this.socket = this.manager.socket('/', {
      auth: (cb) => {
        cb({ token });
      },
    });

    this.socket.on('message', (msg: unknown) => {
      const ev = new Event();
      // eslint-disable-next-line no-console
      console.debug('recv', JSON.stringify(msg, null, 4));
      if (isMessage(msg)) {
        if (isSequenceMessage(msg)) {
          if (this.seqHandlers.exists(msg.seqId)) {
            this.seqHandlers.notify(msg.seqId, msg, ev);
            if (!ev.isHandled()) {
              this.emit(msg.type, msg);
            }
          } else {
            this.emit(msg.type, msg);
          }
        } else {
          this.emit(msg.type, msg);
        }
      }
    });
    this.socket.on('connect', () => { this.emit('con:open'); });
    // eslint-disable-next-line no-console
    this.socket.on('error', (err) => { console.log(err); });
    this.socket.on('disconnect', () => { this.emit('con:close'); });
  }

  send(msg: Message): WebSocketTransport {
    // eslint-disable-next-line no-console
    console.debug('send', JSON.stringify(msg, null, 4));
    this.socket.send(msg);
    return this;
  }

  onSeq(seqId: string, callback: (data: SequenceMessage, ev: Event) => void): WebSocketTransport {
    this.seqHandlers.watch(seqId, callback);
    return this;
  }

  offSeq(seqId: string): WebSocketTransport {
    this.seqHandlers.offAll(seqId);
    return this;
  }

  on(event: string, callback: (data: Message) => void): WebSocketTransport {
    this.bus.watch(event, callback);
    return this;
  }

  once(event: string, callback: (data: Message) => void): WebSocketTransport {
    this.bus.once(event, callback);
    return this;
  }

  off(event: string, callback: (data: Message) => void): WebSocketTransport {
    this.bus.off(event, callback);
    return this;
  }

  private emit(event: string, data?: Message) {
    if (!this.bus.exists(event)) {
      return;
    }
    return this.bus.notify(event, data);
  }
}
