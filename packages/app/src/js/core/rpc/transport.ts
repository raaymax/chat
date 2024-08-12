import { Socket, Manager } from 'socket.io-client';
import { SSESource } from '@planigale/sse';
import { createEventListener } from './utils';
import {
  Message, SequenceMessage, isMessage, isSequenceMessage,
} from './types';
import { Event } from './event';

export interface Transport {
  send: (data: Message) => void;
  onSeq: (seqId: string, callback: (data: Message) => void) => void;
  offSeq: (seqId: string) => void;
  on: (event: string, callback: (data: Message) => void) => Transport;
  once: (event: string, callback: (data: Message) => void) => Transport;
  off: (event: string, callback: (data: Message) => void) => Transport;
  emit: (event: string, data?: Message) => void;
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
          if (this.seqHandlers.exists(msg.seqId ?? '')) {
            this.seqHandlers.notify(msg.seqId ?? '', msg, ev);
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

  onSeq(seqId: string, callback: (data: SequenceMessage, ev?: Event) => void): WebSocketTransport {
    this.seqHandlers.watch(seqId, callback);
    return this;
  }

  offSeq(seqId: string): WebSocketTransport {
    this.seqHandlers.offAll(seqId);
    return this;
  }

  on(event: string, callback: (data: any) => void): WebSocketTransport {
    this.bus.watch(event, callback);
    return this;
  }

  once(event: string, callback: (data: any) => void): WebSocketTransport {
    this.bus.once(event, callback);
    return this;
  }

  off(event: string, callback: (data: any) => void): WebSocketTransport {
    this.bus.off(event, callback);
    return this;
  }

  emit(event: string, data?: any) {
    if (!this.bus.exists(event)) {
      return;
    }
    return this.bus.notify(event, data);
  }
}

export class HttpTransport implements Transport {
  private bus = createEventListener<Message>();

  private seqHandlers = createEventListener<SequenceMessage>();

  private baseUrl: string;

  private token: string;

  private source: SSESource;

  constructor(url: string, token: string) {
    this.baseUrl = url;
    this.token = token;
    setTimeout(() => this.emit('con:open'), 5);
    this.source = new SSESource(`${this.baseUrl}/api/sse`, {
      headers: {
        authorization: `bearer ${this.token}`,
      }
    });
    //TODO use this
  }

  async fetch(url: string, opts: {seqId?: string, mapFn?: (i:any) => any} & RequestInit): Promise<any> {
    const res = await fetch(`${this.baseUrl}${url}`, {
      ...opts,
      headers: {
        ...opts.headers,
        Authorization: `Bearer ${this.token}`,
      },
    });
    if(res.status == 200 || res.status == 204) {
      const data = res.status === 200 ? await res.json() : {};
      return {
        type: 'response',
        status: 'ok',
        seqId: opts.seqId,
        data: [data].flat().map(opts.mapFn ?? ((a) => a)),
      };
    }else{
      return {
        type: 'response',
        status: 'error',
        seqId: opts.seqId,
        error: await res.json()
      };
    }
  }


  send(msg: Message): HttpTransport {
    // eslint-disable-next-line no-console
    console.log('send', msg);
    return this;
  }

  request = async (msg: any): Promise<any> => {
    switch (msg.type) {
      case 'user:config': {
        return this.fetch('/api/profile/config', {seqId: msg.seqId});
      }
      case 'channel:get': {
        return this.fetch(`/api/channels/${msg.id}`, {seqId: msg.seqId});
      }
      case 'channels:load': {
        return this.fetch('/api/channels', {seqId: msg.seqId, mapFn: (i: any) => ({type: 'channel', ...i})});
      }
      case 'user:getAll': {
        return this.fetch('/api/users', {seqId: msg.seqId, mapFn: (i: any) => ({type: 'user', ...i})});
      }
      case 'channel:create': {
        return await this.fetch(`/api/channels`, {
          method: 'POST',
          body: JSON.stringify({name: msg.name, users: msg.users, channelType: msg.channelType}),
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }
      case 'message:create': {
        const createRes = await this.fetch(`/api/channels/${msg.channelId}/messages`, {
          method: 'POST',
          body: JSON.stringify(msg),
          headers: {
            'Content-Type': 'application/json'
          },
        });

        return await this.fetch(`/api/messages/${createRes.data[0].id}`, {method: 'GET'});
      }
      case 'message:getAll': {
        return this.fetch(`/api/channels/${msg.channelId}/messages`, {seqId: msg.seqId, mapFn: (i: any) => ({type: 'message', ...i})});
      }
      case 'message:remove': {
        return await this.fetch(`/api/messages/${msg.id}`, {
          method: 'DELETE',
        });
      }
      case 'message:pin': {
        await this.fetch(`/api/messages/${msg.id}`, {
          method: 'PATCH',
          body: JSON.stringify({pinned: msg.pinned}),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        return await this.fetch(`/api/messages/${msg.id}`, {method: 'GET'});
      }
      default:
        return {
          type: 'response',
          status: 'ok',
          seqId: msg.seqId,
          data: [],
          warning: "No handler for this message type",
        };
    }
  }


  req = async (msg: any): any => {
    console.log('req < ', msg);
    const ret = await this.request(msg);
    console.log('req > ', msg, ret);
    return ret; 
  }

  notif = (msg: any): any => this.send(msg);

  onSeq(seqId: string, callback: (data: SequenceMessage, ev?: Event) => void): HttpTransport {
    this.seqHandlers.watch(seqId, callback);
    return this;
  }

  offSeq(seqId: string): HttpTransport {
    this.seqHandlers.offAll(seqId);
    return this;
  }

  on(event: string, callback: (data: any) => void): HttpTransport {
    this.bus.watch(event, callback);
    return this;
  }

  once(event: string, callback: (data: any) => void): HttpTransport {
    this.bus.once(event, callback);
    return this;
  }

  off(event: string, callback: (data: any) => void): HttpTransport {
    this.bus.off(event, callback);
    return this;
  }

  emit(event: string, data?: any) {
    if (!this.bus.exists(event)) {
      return;
    }
    return this.bus.notify(event, data);
  }
}
