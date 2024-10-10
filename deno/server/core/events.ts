import { Event } from "../events.ts";

export default class Events {
  listeners: ((ev: Event) => Promise<void> | void)[] = [];
  onceListeners: ((ev: Event) => Promise<void> | void)[] = [];

  once(handler: (ev: Event) => Promise<void> | void): () => void{
    this.onceListeners.push(handler);
    return () => {
      const idx = this.onceListeners.indexOf(handler);
      this.onceListeners = [...this.onceListeners.slice(0, idx), ...this.onceListeners.slice(idx+1)]
    }
  }

  on(handler: (ev: Event) => Promise<void> | void): () => void {
    this.listeners.push(handler);
    return () => {
      const idx = this.listeners.indexOf(handler);
      this.listeners = [...this.listeners.slice(0, idx), ...this.listeners.slice(idx+1)]
    }
  }
  
  async dispatch(int: Event): Promise<void> {
    await Promise.all(this.onceListeners.map(listener => listener(int)));
    this.onceListeners = [];
    await Promise.all(this.listeners.map(listener => listener(int)));
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Event> {
    while (true) {
      const {done, event} = await this.next();
      if (done) {
        break;
      }
      yield event;
    }
  }

  next(): Promise<{done: false, event: Event} | {done: true, event: null}> {
    const {promise, resolve} = Promise.withResolvers<{done: false, event: Event} | {done: true, event: null}>();
    const cb = (event: Event) => {
      if(event.type === 'system:close'){
        return resolve({done: true, event: null});
      }
      return resolve({done: false, event});
    }
    this.once(cb);
    return promise;
  }
}
