const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => Promise.all((handlers[name] || []).map(h => h(...args)));
  async function start() {
    const wss = new WebSocket.Server(conf);
    const connections = {}
    const srv = {
      broadcast: (msg) => {
        msg._raw = JSON.stringify(msg);
        return Promise.all(Object.values(connections).map(con => con.user && con.send(msg)));
      }
    }

    await notify('start', srv);

    wss.on('connection', async (ws) => {
      const id = uuid();
      const send = async (msg) => {
        const raw = msg._raw ? msg._raw : JSON.stringify(msg);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(raw)
          await notify('packet:sent', self, msg);
        }
      }
      const self = connections[id] = {
        id,
        ws,
        channel: 'main',
        author: 'Unknown',
        send,
        broadcast: async (msg) => {
          msg.senderId = self.id;
          const ret = await srv.broadcast(msg)
          await notify('broadcast:after', self, msg);
          return ret;
        },
        sys: (data, private, seqId) => send({
          id: uuid(),
          seqId,
          createdAt: new Date().toISOString(), 
          user: {name: "System"},
          private,
          message: data,
        }),
        op: (msg, seqId) => send({seqId, op: msg}),
      };
    
      await notify('connection', self);

      ws.on('message', async (raw) => {
        try{ 
          await notify('packet', self, raw.toString());
          const msg = JSON.parse(raw);
          if(msg.seqId) {
            msg.ok = async (data) => send({seqId: msg.seqId,resp: {status: 'ok', data}});
            msg.error = async (data) => send({seqId: msg.seqId, resp: {status: 'error', data}});
          }else{
            msg.ok = async () => {};
            msg.error = async () => {};
          }
          if(msg.op){ 
            await notify('op', self, msg);
            await notify('op:'+msg.op.type, self, msg);
          } else if(msg.command){
            await notify('command', self, msg);
            await notify('command:'+msg.command.name, self, msg);
          } else if(msg.message) await notify('message', self, msg);
        } catch(err) {
          console.error(err);
        }
      })
      ws.on('close', async () => {
        await notify('disconnect', self);
        delete connections[id];
      });
    })
  }
  const app = {
    on: (prop, ...handler) => {
      const h = (...args) => handler.reverse()
        .reduce((acc, fn) => async () => fn(...args, acc), ()=>{})()
      handlers[prop] = [...(handlers[prop] || []), h];
      return app;
    },
    start,
  }
  return app;
}

module.exports = App;
