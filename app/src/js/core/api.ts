import { SSESource } from '@planigale/sse';
import { Channel } from '../types';

type RequestInit = (typeof fetch)['prototype']['init'];


async function waitBeforeRetry(retry: number) {
  switch (retry) {
    case 0:
      await new Promise((r) => setTimeout(r, 1000));
      break;
    case 1:
      await new Promise((r) => setTimeout(r, 2000));
      break;
    default:
      await new Promise((r) => setTimeout(r, 5000));
      break;
  }
}



export class ApiError extends Error {
  payload: any;
  url: string
  status: number;
  constructor(msg: string, status:number, url: string, payload: any) {
    super(msg);
    this.status = status;
    this.url = url;
    this.payload = payload; 
  }
}

class API extends EventTarget {
  baseUrl: string;

  token: string;

  source: SSESource | null;

  abortController: AbortController;

  constructor(url: string, token: string) {
    super();
    this.baseUrl = url;
    this.token = token;
    this.abortController = new AbortController();
    this.source = null;
    document.addEventListener('freeze', () => {
      console.log('[SSE] App is frozen');
      this.abortController.abort("App is frozen");
    });
    document.addEventListener('resume', () => {
      console.log('[SSE] App is resumed');
      this.abortController = new AbortController();
      this.reconnect(this.abortController.signal);
    });
    this.reconnect(this.abortController.signal);
  }

  async reconnect(signal?: AbortSignal) {
    try {
      console.log('events reconnecting SSE');
      await this.listen();
    } catch (e) {
      console.error('[API_SSE]',e);
    } finally {
      if(signal && !signal.aborted){
        setTimeout(() => this.reconnect(signal), 1000);
      }
    }
  }

  async listen(signal?: AbortSignal) {
    if(signal && signal.aborted) return;
    try {
      console.log('events listening');
      this.source = new SSESource(`${this.baseUrl}/api/sse`, {
        signal,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (!this.source) return;
      for await (const event of this.source) {
        if (event.data === '') continue;
        const data = JSON.parse(event.data);
        console.debug('[SSE]', data);
        this.dispatchEvent(new CustomEvent(data.type, { detail: data }));
      }
      console.log('event disconnected');
    } finally {
      if (this.source){
        await this.source.close();
        this.source = null;
      }
    }
  }

  async fetch(url: string, opts: {seqId?: string, mapFn?: (i:any) => any, retry?: number, retries?: number} & RequestInit = {}): Promise<any> {
    const retries = opts?.retries ?? 5;
    const retry = opts?.retry ?? 0;
    const res = await fetch(`${this.baseUrl}${url}`, {
      ...opts,
      headers: {
        ...opts.headers || {},
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (res.status == 200 || res.status == 204) {
      const data = res.status === 200 ? await res.json() : {};
      return {
        type: 'response',
        status: 'ok',
        seqId: opts.seqId,
        data: [data].flat().map(opts.mapFn ?? ((a) => a)),
      };
    }

    if (res.status >= 500) {
      if (retries > 0) {
        try{
          console.log(await res.json());
        }catch{}
        await waitBeforeRetry(retry);
        return this.fetch(url, { ...opts, retries: retries - 1, retry: retry + 1 });
      } else {
        return {
          type: 'response',
          status: 'error',
          seqId: opts.seqId,
          error: await res.json(),
        };
      }
    }

    return {
      type: 'response',
      status: 'error',
      seqId: opts.seqId,
      error: await res.json(),
    };
  }

  getResource = async <T = any>(url: string, retries = 5, retry = 0): Promise<T | null> => {
    const res = await fetch(`${this.baseUrl}${url}`);
    if (res.status === 404) {
      return null;
    }

    if (res.status >= 500) {
      if (retries > 0) {
        try{
          console.log(await res.json());
        }catch{}
        await waitBeforeRetry(retry);
        return this.getResource(url, retries - 1, retry + 1);
      } else {
        throw new ApiError("Server error", res.status, url, await res.json());
      }
    }

    if (res.status >= 400) {
      throw new ApiError("Api error", res.status, url, await res.json())
    }
    return await res.json()
  }

  getUserConfig = async () => this.getResource(`/api/profile/config`);
  getChannelById = async (channelId: string) => this.getResource(`/api/channels/${channelId}`);
  getChannels = async () => this.getResource(`/api/channels`);

  getMessages = async (q: {before?: string, after?: string, limit?: number, channelId: string, parentId?: string}) => {
      const {channelId, ...query} = q;
      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(query).filter(([_, v]) => typeof v !== 'undefined')),
        parentId: query.parentId ?? null,
      } as any);
      return this.getResource(`/api/channels/${channelId}/messages?${params.toString()}`);
  };

  async putDirectChannel(userId: string): Promise<Channel> {
    const res = await fetch(`${this.baseUrl}/api/channels/direct/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
    return await res.json();
  }

  async getDirectChannel(userId: string): Promise<Channel> {
    try{
      const res = await fetch(`${this.baseUrl}/api/channels/direct/${userId}`, {
        method: 'GET',
      });
      const json = await res.json();
      return json;
    }catch(e){
      console.log(e)
      throw e;
    }
  }

  async postInteraction(data: {channelId: string, parentId?: string, appId: string, clientId: string, action: string, payload: any}): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/interactions`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
    await res.body?.cancel();
  }

  async sendMessage(msg: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/channels/${msg.channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (res.status !== 200) {
      throw await res.json();
    }
    return await res.json();
  }

  on = this.addEventListener.bind(this);

  emit = this.dispatchEvent.bind(this);

  request = async (msg: any): Promise<any> => {
    switch (msg.type) {
    case 'user:config': {
      return this.fetch('/api/profile/config', { seqId: msg.seqId });
    }
    case 'channel:get': {
      return this.fetch(`/api/channels/${msg.id}`, { seqId: msg.seqId });
    }
    case 'channels:load': {
      return this.fetch('/api/channels', { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'channel', ...i }) });
    }
    case 'user:getAll': {
      return this.fetch('/api/users', { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'user', ...i }) });
    }
    case 'user:get': {
      return this.fetch(`/api/users/${msg.id}`, { seqId: msg.seqId });
    }
    case 'emoji:getAll': {
      return this.fetch('/api/emojis', { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'emoji', ...i }) });
    }
    case 'channel:create': {
      return await this.fetch('/api/channels', {
        method: 'POST',
        body: JSON.stringify({ name: msg.name, users: msg.users, channelType: msg.channelType }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'message:create': {
      const createRes = await this.fetch(`/api/channels/${msg.channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify(msg),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.fetch(`/api/messages/${createRes.data[0].id}`, { method: 'GET' });
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
      query.parentId = msg.parentId || null;
      console.log('query', query);
      const params = new URLSearchParams(query);
      return this.fetch(`/api/channels/${msg.channelId}/messages?${params.toString()}`, { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'message', ...i }) });
    }
    case 'message:pins': {
      const query: any = { pinned: true };
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
      return this.fetch(`/api/channels/${msg.channelId}/messages?${params.toString()}`, { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'message', ...i }) });
    }
    case 'message:remove': {
      return await this.fetch(`/api/messages/${msg.id}`, {
        method: 'DELETE',
      });
    }
    case 'message:pin': {
      await this.fetch(`/api/messages/${msg.id}/pin`, {
        method: 'PUT',
        body: JSON.stringify({ pinned: msg.pinned }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await this.fetch(`/api/messages/${msg.id}`, { method: 'GET' });
    }
    case 'command:execute': {
      return this.fetch('/api/commands/execute', {
        method: 'POST',
        body: JSON.stringify(msg),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'message:search':
      return this.fetch(`/api/channels/${msg.channelId}/messages?q=${msg.text}`, {
        seqId: msg.seqId,
        mapFn: (i: any) => ({ type: 'search', ...i }),
      });
    case 'readReceipt:getOwn': {
      return this.fetch('/api/read-receipts', {
        seqId: msg.seqId,
        mapFn: (i: any) => ({ type: 'badge', ...i }),
      });
    }
    case 'readReceipt:getChannel': {
      return this.fetch(`/api/channels/${msg.channelId}/read-receipts`, {
        seqId: msg.seqId,
        mapFn: (i: any) => ({ type: 'badge', ...i }),
      });
    }
    case 'readReceipt:update': {
      return this.fetch('/api/read-receipts', {
        method: 'POST',
        body: JSON.stringify({ messageId: msg.messageId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'message:react': {
      return this.fetch(`/api/messages/${msg.id}/react`, {
        method: 'PUT',
        body: JSON.stringify({ reaction: msg.reaction }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'user:typing': {
      return this.fetch(`/api/channels/${msg.channelId}/typing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId: msg.parentId }),
      });
    }
    default:
      return {
        type: 'response',
        status: 'error',
        seqId: msg.seqId,
        data: [],
        error: 'No handler for this message type',
      };
    }
  };

  req = async (msg: any): Promise<any> => {
    console.debug('[API] req out', msg);
    const ret = await this.request(msg);
    console.debug('[API] req in', msg, ret);
    return ret;
  };
}

export default API;
