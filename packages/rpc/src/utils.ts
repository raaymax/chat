type HandlerStore<ArgType> = {
  [key: string]: ((data: ArgType) => Promise<void> | void)[];
}

export const createEventListener = <ArgType>() => {
  const handlers: HandlerStore<ArgType> = {};
  const notify = (ev: string, arg: ArgType) => {
    if (!handlers[ev] || handlers[ev].length === 0) {
      // eslint-disable-next-line no-console
      console.log('Event not handled', ev, arg);
    }
    return Promise.all(
      (handlers[ev] || [])
        .map(async (listener) => {
          try {
            await listener(arg);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
          }
        }),
    );
  };
  // eslint-disable-next-line no-return-assign
  const watch = (ev: string, fn: (arg: ArgType) => void ) => {
    (handlers[ev] = handlers[ev] || []).push(fn);
  };

  const offAll = (ev: string) => {
    handlers[ev] = [];
  }

  const off = (ev: string, fn: (arg: ArgType) => void ) => {
    handlers[ev] = (handlers[ev] || [])
      .filter((listener) => listener !== fn);
  }
  const once = (ev: string, fn: (arg: ArgType) => void) => {
    handlers[ev] = handlers[ev] || [];
    const cb = async (arg: ArgType) => {
      const idx = handlers[ev].findIndex((c) => c === cb);
      handlers[ev].splice(idx, 1);
      return fn(arg);
    };
    handlers[ev].push(cb);
  };

  const exists = (ev: string) => Array.isArray(handlers[ev]) && handlers[ev].length > 0;

  return {
    watch, once, notify, exists, off, offAll,
  };
};
