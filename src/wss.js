const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => Promise.all((handlers[name] || []).map(h => h(...args)));
  async function start() {
    const wss = new WebSocket.Server(conf);
    const connections = {}
    const sysMsg = (data, private = false) => {
      return {
        id: uuid(),
        createdAt: new Date().toISOString(), 
        author: "System", 
        private,
        message: data,
      };
    }
    const com = {
      broadcast: (msg) => {
        msg._raw = JSON.stringify(msg);
        return Promise.all(Object.values(connections).map(con => con.send(msg)));
      }
    }
    const srv = {
      ...com,
      sysBroadcast: (text) => {
        return com.broadcast(sysMsg([{text}]));
      },
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
        broadcast: (msg) => {
          msg.senderId = self.id;
          return srv.broadcast(msg)
        },
        sys: (data, private) => send({
          id: uuid(),
          createdAt: new Date().toISOString(), 
          user: {name: "System"},
          private,
          message: data,
        }),
        op: (msg) => send({op: msg}),
      };
    
      await notify('connection', self);

      ws.on('message', async (raw) => {
        try{ 
          await notify('packet', self, raw.toString());
          const msg = JSON.parse(raw);
          if(msg.seqId) {
            msg.ok = (data) => send({seqId: msg.seqId,  resp: {status: 'ok', data}});
            msg.error = (data) => send({seqId: msg.seqId, resp: {status: 'error', data}});
          }else{
            msg.ok = () => {};
            msg.error = () => {};
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
    on: (prop, handler) => {
      handlers[prop] = [...(handlers[prop] || []), handler];
      return app;
    },
    start,
  }
  return app;
}

module.exports = App;
