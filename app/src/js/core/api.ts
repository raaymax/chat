import { SSESource } from "@planigale/sse";

class API extends EventTarget {
  baseUrl: string;
  token: string;
  source: SSESource;

  constructor(url: string, token: string) {
    super();
    this.baseUrl = url;
    this.token = token;
    this.source = new SSESource(`${this.baseUrl}/api/sse`, {
      fetch: (...args) => fetch(...args),
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    this.listen();
  }

  async reconnect() {
    try {
      console.log('events reconnecting');
      await this.source.close();
      console.log('events reconnecting SSE');
      this.source = new SSESource(`${this.baseUrl}/api/sse`, {
        fetch: (...args) => fetch(...args),
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      console.log('events reconnecting listen');
      this.listen();
    } catch(e) {
      console.error('events tutaj', e);
      setTimeout(() => this.reconnect(), 1000);
    }
  }

  async listen() {
    try {
      console.log('events listening');
      for await (const event of this.source) {
        if (event.data === '') continue;
        console.log('event raw', event);
        const data = JSON.parse(event.data);
        console.log('event', data);
        this.dispatchEvent(new CustomEvent(data.type, {detail: data}));
      }
      console.log('event disconnected');
      setTimeout(() => this.reconnect(), 1);
    }catch(e) {
      console.error(e);
    }
  }

  async fetch(url: string, opts: {seqId?: string, mapFn?: (i:any) => any} & RequestInit = {}): Promise<any> {
    const res = await fetch(`${this.baseUrl}${url}`, {
      ...opts,
      headers: {
        ...opts.headers || {},
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

  on = this.addEventListener.bind(this);

  emit = this.dispatchEvent.bind(this);

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
      case 'user:get': {
        return this.fetch(`/api/users/${msg.id}`, {seqId: msg.seqId});
      }
      case 'emoji:getAll': {
        return this.fetch('/api/emojis', {seqId: msg.seqId, mapFn: (i: any) => ({type: 'emoji', ...i})});
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
        const query: any = {};
        if (msg.before) {
          query.before = msg.before;
        }
        if (msg.after) {
          query.after = msg.after;
        }
        if (msg.limit) {
          query.limit = msg.limit;
        }
        if (msg.offset) {
          query.offset = msg.offset;
        }
        if (msg.order) {
          query.order = msg.order;
        }
        if (msg.search) {
          query.search = msg.search;
        }


        const params = new URLSearchParams(query);
        return this.fetch(`/api/channels/${msg.channelId}/messages?${params.toString()}`, {seqId: msg.seqId, mapFn: (i: any) => ({type: 'message', ...i})});
      }
      case 'message:pins': {
        const query: any = {pinned: true};
        if (msg.before) {
          query.before = msg.before;
        }
        if (msg.after) {
          query.after = msg.after;
        }
        if (msg.limit) {
          query.limit = msg.limit;
        }
        if (msg.offset) {
          query.offset = msg.offset;
        }
        if (msg.order) {
          query.order = msg.order;
        }
        if (msg.search) {
          query.search = msg.search;
        }


        const params = new URLSearchParams(query);
        return this.fetch(`/api/channels/${msg.channelId}/messages?${params.toString()}`, {seqId: msg.seqId, mapFn: (i: any) => ({type: 'message', ...i})});
      }
      case 'message:remove': {
        return await this.fetch(`/api/messages/${msg.id}`, {
          method: 'DELETE',
        });
      }
      case 'message:pin': {
        await this.fetch(`/api/messages/${msg.id}/pin`, {
          method: 'PUT',
          body: JSON.stringify({pinned: msg.pinned}),
          headers: {
            'Content-Type': 'application/json'
          },
        });
        return await this.fetch(`/api/messages/${msg.id}`, {method: 'GET'});
      }
      case 'command:execute': {
        return this.fetch(`/api/commands/execute`, {
          method: 'POST',
          body: JSON.stringify(msg),
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }
      case 'message:search': 
        return this.fetch(`/api/channels/${msg.channelId}/messages?q=${msg.text}`, {
        seqId: msg.seqId,
        mapFn: (i: any) => ({type: 'search', ...i})
      });
      case 'readReceipt:getOwn': {
        return this.fetch(`/api/read-receipts`, {
          seqId: msg.seqId, 
          mapFn: (i: any) => ({type: 'badge', ...i})
        });
      }
      case 'readReceipt:getChannel': {
        return this.fetch(`/api/channels/${msg.channelId}/read-receipts`, {
          seqId: msg.seqId, 
          mapFn: (i: any) => ({type: 'badge', ...i})
        });
      }
      case 'readReceipt:update': {
        return this.fetch(`/api/read-receipts`, {
          method: 'POST',
          body: JSON.stringify({messageId: msg.messageId}),
          headers: {
            'Content-Type': 'application/json'
          },
        });
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


  req = async (msg: any): Promise<any> => {
    console.log('req < ', msg);
    const ret = await this.request(msg);
    console.log('req > ', msg, ret);
    return ret; 
  }
}

export default API;
