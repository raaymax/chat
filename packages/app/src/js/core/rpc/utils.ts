import { Event } from './event';

type HandlerStore<ArgType> = {
  [key: string]: ((data: ArgType, ev?: Event) => Promise<void> | void)[];
}

export const createEventListener = <ArgType>() => {
  const handlers: HandlerStore<ArgType> = {};
  const notify = (id: string, arg: ArgType, ev?: Event) => {
    if (!handlers[id] || handlers[id].length === 0) {
      // eslint-disable-next-line no-console
      console.log('Event not handled', id, arg);
    }
    return Promise.all(
      (handlers[id] || [])
        .map(async (listener) => {
          try {
            await listener(arg, ev);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
          }
        }),
    );
  };
  const watch = (evid: string, fn: (arg: ArgType, ev?: Event) => void) => {
    (handlers[evid] = handlers[evid] || []).push(fn);
  };

  const offAll = (id: string) => {
    handlers[id] = [];
  };

  const off = (id: string, fn: (arg: ArgType, ev?: Event) => void) => {
    handlers[id] = (handlers[id] || [])
      .filter((listener) => listener !== fn);
  };
  const once = (id: string, fn: (arg: ArgType, ev?: Event) => void) => {
    handlers[id] = handlers[id] || [];
    const cb = async (arg: ArgType, ev?: Event) => {
      const idx = handlers[id].findIndex((c) => c === cb);
      handlers[id].splice(idx, 1);
      return fn(arg, ev);
    };
    handlers[id].push(cb);
  };

  const exists = (id: string) => Array.isArray(handlers[id]) && handlers[id].length > 0;

  return {
    watch, once, notify, exists, off, offAll,
  };
};
