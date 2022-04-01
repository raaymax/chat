const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => Promise.all((handlers[name] || []).map((h) => h(...args)));
  async function start() {
    //wait for http
    await new Promise(resolve => setTimeout(resolve, 1000));
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
        sys: (data, priv, seqId) => send({
          id: uuid(),
          seqId,
          createdAt: new Date().toISOString(),
          user: { name: 'System' },
          priv,
          message: data,
        }),
        op: (msg, seqId) => send({ seqId, op: msg }),
      };

      connections[id] = self;
      await notify('connection', self);

      ws.on('message', async (raw) => {
        try {
          await notify('packet', self, raw.toString());
          const msg = JSON.parse(raw);
          if (msg.seqId) {
            msg.ok = async (data) => send({ seqId: msg.seqId, resp: { status: 'ok', data } });
            msg.error = async (data) => send({ seqId: msg.seqId, resp: { status: 'error', data } });
          } else {
            msg.ok = async () => {};
            msg.error = async () => {};
          }
          if (msg.op) {
            await notify('op', self, msg);
            await notify(`op:${msg.op.type}`, self, msg);
          } else if (msg.command) {
            await notify('command', self, msg);
            await notify(`command:${msg.command.name}`, self, msg);
          } else if (msg.message) await notify('message', self, msg);
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
