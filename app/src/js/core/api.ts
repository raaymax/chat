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

  _http: any;
  _token: string | undefined;

  userId: string | undefined;

  source: SSESource | null;

  tokenInit: () => void;

  abortController: AbortController;

  set token(value: any) {
    if (typeof value === 'string' && value.trim() !== '') {
        this._token = value;
        this.tokenInit();
    }
  }

  get token() {
    return this._token;
  }

  constructor(url: string) {
    super();
    this.baseUrl = window.isTauri ? url : '';
    this.abortController = new AbortController();
    this.source = null;
    this.tokenInit = () => {
      this.abortController.abort("App is frozen");
      this.abortController = new AbortController();
      this.reconnect(this.abortController.signal);
    };
    this.userId = localStorage.userId;
    this.token = localStorage.token;
  }

  init = () => {
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
    let fetch = window.fetch.bind(window);
    if(window.isTauri) {
      if(!this._http){
        this._http = import('@tauri-apps/plugin-http');
      }
      fetch = (await this._http).fetch;
    }
    if(signal && signal.aborted) return;
    try {
      console.log(`events listening ${this.baseUrl}/api/sse`);
      this.source = new SSESource(`${this.baseUrl}/api/sse`, {
        signal,
        fetch: fetch,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (!this.source) return;
      this.emit(new CustomEvent('con:open', { detail: {}}));
      for await (const event of this.source) {
        if (event.data === '') continue;
        const data = JSON.parse(event.data);
        console.debug('[SSE]', data);
        this.dispatchEvent(new CustomEvent(data.type, { detail: data }));
      }
      console.log('event disconnected');
    } finally {
      this.emit(new CustomEvent('con:close', { detail: {}}));
      if (this.source){
        await this.source.close();
        this.source = null;
      }
    }
  }

  async fetch(url: string, opts: RequestInit = {}): Promise<any>{
    let fetch = window.fetch.bind(window);
    if(window.isTauri) {
      if(!this._http){
        this._http = import('@tauri-apps/plugin-http');
      }
      fetch = (await this._http).fetch;
    }
    return await fetch(`${this.baseUrl}${url}`, this.token ? {
      credentials: 'include',
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers || {},
        Authorization: `Bearer ${this.token}`,
      },
    }: {
      credentials: 'include',
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers || {},
      },
    });
  }

  async callApi(url: string, opts: {seqId?: string, mapFn?: (i:any) => any, retry?: number, retries?: number} & RequestInit = {}): Promise<any> {
    const retries = opts?.retries ?? 5;
    const retry = opts?.retry ?? 0;
    const res = await this.fetch(url, opts);
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
        }catch{/*ignore*/}
        await waitBeforeRetry(retry);
        return this.callApi(url, { ...opts, retries: retries - 1, retry: retry + 1 });
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
    const res = await this.fetch(url);
    if (res.status === 404) {
      return null;
    }

    if (res.status >= 500) {
      if (retries > 0) {
        try{
          console.log(await res.json());
        }catch{/*ignore*/}
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
    const res = await this.fetch(`/api/channels/direct/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
    return await res.json();
  }

  async getDirectChannel(userId: string): Promise<Channel> {
    try{
      const res = await this.fetch(`/api/channels/direct/${userId}`, {
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
    const res = await this.fetch(`/api/interactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await res.body?.cancel();
  }

  async sendMessage(msg: any): Promise<any> {
    const res = await this.fetch(`/api/channels/${msg.channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify(msg),
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
      return this.callApi('/api/profile/config', { seqId: msg.seqId });
    }
    case 'channel:get': {
      return this.callApi(`/api/channels/${msg.id}`, { seqId: msg.seqId });
    }
    case 'channels:load': {
      return this.callApi('/api/channels', { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'channel', ...i }) });
    }
    case 'user:getAll': {
      return this.callApi('/api/users', { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'user', ...i }) });
    }
    case 'user:get': {
      return this.callApi(`/api/users/${msg.id}`, { seqId: msg.seqId });
    }
    case 'emoji:getAll': {
      return this.callApi('/api/emojis', { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'emoji', ...i }) });
    }
    case 'channel:create': {
      return await this.callApi('/api/channels', {
        method: 'POST',
        body: JSON.stringify({ name: msg.name, users: msg.users, channelType: msg.channelType }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'message:create': {
      const createRes = await this.callApi(`/api/channels/${msg.channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify(msg),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.callApi(`/api/messages/${createRes.data[0].id}`, { method: 'GET' });
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
      return this.callApi(`/api/channels/${msg.channelId}/messages?${params.toString()}`, { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'message', ...i }) });
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
      return this.callApi(`/api/channels/${msg.channelId}/messages?${params.toString()}`, { seqId: msg.seqId, mapFn: (i: any) => ({ type: 'message', ...i }) });
    }
    case 'message:remove': {
      return await this.callApi(`/api/messages/${msg.id}`, {
        method: 'DELETE',
      });
    }
    case 'message:pin': {
      await this.callApi(`/api/messages/${msg.id}/pin`, {
        method: 'PUT',
        body: JSON.stringify({ pinned: msg.pinned }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await this.callApi(`/api/messages/${msg.id}`, { method: 'GET' });
    }
    case 'command:execute': {
      return this.callApi('/api/commands/execute', {
        method: 'POST',
        body: JSON.stringify(msg),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'message:search':
      return this.callApi(`/api/channels/${msg.channelId}/messages?q=${msg.text}`, {
        seqId: msg.seqId,
        mapFn: (i: any) => ({ type: 'search', ...i }),
      });
    case 'readReceipt:getOwn': {
      return this.callApi('/api/read-receipts', {
        seqId: msg.seqId,
        mapFn: (i: any) => ({ type: 'badge', ...i }),
      });
    }
    case 'readReceipt:getChannel': {
      return this.callApi(`/api/channels/${msg.channelId}/read-receipts`, {
        seqId: msg.seqId,
        mapFn: (i: any) => ({ type: 'badge', ...i }),
      });
    }
    case 'readReceipt:update': {
      return this.callApi('/api/read-receipts', {
        method: 'POST',
        body: JSON.stringify({ messageId: msg.messageId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'message:react': {
      return this.callApi(`/api/messages/${msg.id}/react`, {
        method: 'PUT',
        body: JSON.stringify({ reaction: msg.reaction }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    case 'user:typing': {
      return this.callApi(`/api/channels/${msg.channelId}/typing`, {
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

  async validateSession() {
    const ret = await this.fetch('/api/auth/session');
    const user = await ret.json();
    if (user.status === 'ok') {
      localStorage.setItem('userId', user.user);
      this.token = user.token;
      localStorage.setItem('token', user.token); // TODO: remove
    }
    return user;
  };
  async login(value: {login: string, password: string}) {
    const ret = await this.fetch('/api/auth/session', {
      method: 'POST',
      body: JSON.stringify(value),
    });
    const json = await ret.json();
    this.token = json.token;
    localStorage.setItem('token', json.token); // TODO: remove
    return json;
  };
  async logout() {
    localStorage.removeItem('token'); // TODO: remove
    localStorage.removeItem('userId');

    const ret = await this.fetch('/api/auth/session', {
      method: 'DELETE',
      body: '{}',
    });
    await ret.body?.cancel();
    window.location.reload();
  };
  async checkRegistrationToken(value: { token: string }) {
    const ret = await this.fetch(`/api/users/token/${value.token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await ret.json();
  };

  async register(value: { name: string, email: string, password: string, token: string }) {
    const ret = await this.fetch(`/api/users/${value.token}`, {
      method: 'POST',
      body: JSON.stringify(value),
    });
    if (ret.status !== 200) {
      throw await ret.json();
    }
    return await ret.json();
  };

  me(): string {
    return this.userId;
  };

  isProbablyLogged(): Boolean{
    return !!this.token; // TODO: remove
  };
}




export default API;
