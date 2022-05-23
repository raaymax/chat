const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => Promise.all((handlers[name] || []).map((h) => h(...args)));
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
          await notify('packet:sent', self, msg);
        }
      };
      const self = {
        id,
        ws,
        channel: 'main',
        author: 'Unknown',
        send,
        broadcast: async (msg) => {
          msg.senderId = self.id;
          const ret = await srv.broadcast(msg);
          await notify('broadcast:after', self, msg);
          return ret;
        },
        sys: (data, { priv, seqId, msgId = uuid() }) => send({
          id: msgId,
          type: 'message',
          seqId,
          createdAt: new Date().toISOString(),
          user: { name: 'System' },
          priv,
          message: data,
        }),
        op: (msg, seqId) => send({ seqId, ...msg }),
      };

      connections[id] = self;
      await notify('connection', self);

      ws.on('message', async (raw) => {
        try {
          await notify('packet', self, raw.toString());
          const msg = JSON.parse(raw);
          if (msg.seqId) {
            msg.ok = async (data) => send({
              type: 'response', seqId: msg.seqId, status: 'ok', data,
            });
            msg.error = async (data) => send({
              type: 'response',
              seqId: msg.seqId,
              status: 'error',
              data: {
                ...data,
                errorCode: data.errorCode || 'UNEXPECTED_ERROR',
              },
            });
          } else {
            msg.ok = async () => {};
            msg.error = async () => {};
          }
          if (msg.type === 'command') {
            await notify('command', self, msg);
            if (handlers[`command:${msg.cmd}`]) {
              await notify(`command:${msg.cmd}`, self, msg);
            } else {
              await notify('command:*', self, msg);
            }
          } else if (msg.type === 'message') {
            await notify('message', self, msg);
          } else if (handlers[msg.type]) {
            await notify(msg.type, self, msg);
          } else {
            await notify('*', self, msg);
          }
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

module.exports = App;
