/* eslint-disable no-console */
const nextId = () => `log:${Math.random().toString(32).slice(2)}`;

export const createLogger = (client) => {
  const store = [];

  const upload = async () => {
    try {
      while (store.length > 0) {
        const log = store[0];
        await client.req({type: 'log', ...log});
        store.pop();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  const serialize = (args) => args.map((arg) => {
    if ( arg instanceof Error ) {
      return {
        message: arg.message,
        stack: arg.stack.split('\n'),
      };
    }
    return arg;
  });

  const add = ({level, args}) => {
    console.log(level, ...args);
    const entry = {
      clientId: nextId(),
      level,
      args: serialize(args),
      createdAt: new Date(),
    };
    store.push(entry);
    return upload();
  }

  return ({
    log: (...args) => add({ level: 'log', args }),
    info: (...args) => add({ level: 'info', args }),
    warn: (...args) => add({ level: 'warn', args }),
    error: (...args) => add({ level: 'error', args }),
    debug: (...args) => add({ level: 'debug', args }),
  });
}
