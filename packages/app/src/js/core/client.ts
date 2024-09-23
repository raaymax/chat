import Api from './api';

declare global {
  const API_URL: string;
}

class Client {
  _api: Api;
  get api() {
    if (!this._api) {
      this._api = new Api(API_URL, localStorage.token);
      setTimeout(() => this.emit('con:open', {}), 10);
    }
    return this._api;
  }

  req(...args: any[]) {
    return this.api.req(...args);
  }

  on(name: string, cb: (e: any) => void) {
    this.api.on(name, (ev: CustomEvent) => cb(ev.detail));
    return this;
  }

  emit(type: string, data: any) {
    return this.api.emit(new CustomEvent(type, {detail: data}));
  }

}


export const client = new Client();

