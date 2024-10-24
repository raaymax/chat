import { Event } from "../events.ts";

export default class Events {
  listeners: ((ev: Event) => Promise<void> | void)[] = [];
  onceListeners: ((ev: Event) => Promise<void> | void)[] = [];


  wrapHandler(handler: (ev: Event) => Promise<void> | void): (ev: Event) => Promise<void> | void {
    return async (ev: Event) => {
      try {
        return await handler(ev);
      } catch (err) {
        console.error(err);
      }
    };
  }

  once(handler: (ev: Event) => Promise<void> | void): () => void {
    const wrappedHandler = this.wrapHandler(handler);
    this.onceListeners.push(wrappedHandler);
    return () => {
      const idx = this.onceListeners.indexOf(wrappedHandler);
      this.onceListeners = [
        ...this.onceListeners.slice(0, idx),
        ...this.onceListeners.slice(idx + 1),
      ];
    };
  }

  on(handler: (ev: Event) => Promise<void> | void): () => void {
    const wrappedHandler = this.wrapHandler(handler);
    this.listeners.push(wrappedHandler);
    return () => {
      const idx = this.listeners.indexOf(wrappedHandler);
      this.listeners = [
        ...this.listeners.slice(0, idx),
        ...this.listeners.slice(idx + 1),
      ];
    };
  }

  async dispatch(int: Event): Promise<void> {
    try {
      await Promise.all(this.onceListeners.map((listener) => listener(int)));
      this.onceListeners = [];
      await Promise.all(this.listeners.map((listener) => listener(int)));
    } catch (err) {
      console.error(err);
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Event> {
    while (true) {
      const { done, event } = await this.next();
      if (done) {
        break;
      }
      yield event;
    }
  }

  next(): Promise<{ done: false; event: Event } | { done: true; event: null }> {
    const { promise, resolve } = Promise.withResolvers<
      { done: false; event: Event } | { done: true; event: null }
    >();
    const cb = (event: Event) => {
      if (event.type === "system:close") {
        return resolve({ done: true, event: null });
      }
      return resolve({ done: false, event });
    };
    this.once(cb);
    return promise;
  }
}
