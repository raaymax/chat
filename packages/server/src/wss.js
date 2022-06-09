const WebSocket = require('ws');
const { v4: uuid } = require('uuid');
const connections = require('./connections');
const Errors = require('./errors');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => {
    const list = handlers[name] || handlers['*'] || [];
    return Promise.all(list.map((h) => h(...args)));
  };
  async function start() {
    if (process.env.NODE_ENV === 'production') {
      // wait for http to make sure reload will be successful
      // FIXME: this is just workaround
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
    }
    const wss = new WebSocket.Server(conf);

    await notify('start');

    wss.on('connection', async (ws) => {
      ws.once('message', async (raw) => {
        const send = async (msg) => {
          const raw = msg._raw ? msg._raw : JSON.stringify(msg);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(raw);
          }
        };
        const msg = wrapMessage(raw, send);
        if (msg.type === 'auth') {
          const self = connections.getByConnection(ws, msg.token, send);
          if (!self) return msg.error(Errors.AccessDenied());

          ws.on('message', async (raw) => {
            try {
              const msg = wrapMessage(raw, send);
              await notify(msg.type, self, msg);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }
          });

          ws.on('close', async () => {
            await notify('disconnect', self);
          });

          await notify('connection', self);
          send({ type: 'auth:user', user: self.user });
          msg.ok({});
        }
      });
    });
  }
  const app = {
    on: (prop, handler) => {
      handlers[prop] = [...(handlers[prop] || []), handler];
      return app;
    },
    start,
  };
  return app;
};

function wrapMessage(raw, send) {
  const msg = JSON.parse(raw);
  if (msg.seqId) {
    msg.ok = async (data) => send(createResponse(msg.seqId, 'ok', data));
    msg.error = async (data) => send(createResponse(msg.seqId, 'error', {
      ...data,
      errorCode: data.errorCode || 'UNEXPECTED_ERROR',
    }));
  } else {
    msg.ok = async () => {};
    msg.error = async () => {};
  }
  return msg;
}

function createResponse(seqId, status, data) {
  return {
    type: 'response', seqId, status, data,
  };
}

module.exports = App;
