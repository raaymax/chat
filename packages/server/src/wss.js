const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => {
    const list = handlers[name] || handlers['*'] || [];
    return Promise.all(list.map((h) => h(...args)) )
  };
  async function start() {
    if (process.env.NODE_ENV === 'production') {
      // wait for http to make sure reload will be successful
      // FIXME: this is just workaround
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
    }
    const wss = new WebSocket.Server(conf);
    const connections = {};
    const srv = {
      broadcast: (msg) => {
        msg._raw = JSON.stringify(msg);
        return Promise.all(Object.values(connections).map((con) => con.user && con.send(msg)));
      },
    };

    await notify('start', srv);

    wss.on('connection', async (ws) => {
      const id = uuid();
      const send = async (msg) => {
        const raw = msg._raw ? msg._raw : JSON.stringify(msg);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(raw);
          //await notify('packet:sent', self, msg);
        }
      };
      const self = {
        id,
        ws,
        channel: 'main',
        send,
        broadcast: async (msg) => {
          msg.senderId = self.id;
          const ret = await srv.broadcast(msg);
          await notify('broadcast:after', self, msg);
          return ret;
        },
        op: (msg, seqId) => send({ seqId, ...msg }),
      };

      connections[id] = self;
      await notify('connection', self);

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
        delete connections[id];
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
