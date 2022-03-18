const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const App = (conf = {}) => {
  const handlers = {};
  const notify = (name, ...args) => Promise.all((handlers[name] || []).map(h => h(...args)));
  async function start() {
    const port = conf.port || 8000;
    const wss = new WebSocket.Server({ port });
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
      sysMsg,
      broadcastChannel: (channel, msg) => {
        const raw = JSON.stringify(msg);
        Object.values(connections)
          .filter(con => con.channels.include(channel))
          .forEach(con => { 
            if (con.ws.readyState === WebSocket.OPEN) {
              con.ws.send(raw)
            }
          });
      },
      broadcast: (msg) => {
        const raw = JSON.stringify(msg);
        Object.values(connections).forEach(con => { 
          if (con.ws.readyState === WebSocket.OPEN) {
            con.ws.send(raw)
          }
        });
      },
      send: (conId, msg) => {
        const raw = JSON.stringify(msg);
        const con = connections[conId];
        if (con.ws.readyState === WebSocket.OPEN) {
          con.ws.send(raw)
        }
      }
    }
    const srv = {
      port,
      ...com,
      sysBroadcast: (text) => {
        return com.broadcast(sysMsg([{text}]));
      },
    }

    await notify('start', srv);

    wss.on('connection', async (ws) => {
      const id = uuid();
      const self = connections[id] = {
        id,
        ws,
        channel: 'main',
        author: 'Unknown',
        send: (msg) => {
          const raw = JSON.stringify(msg);
          ws.send(raw)
        },
        op: (msg) => {
          const raw = JSON.stringify({op: msg});
          ws.send(raw)
        }
      };
      await notify('connection', srv, self);

      ws.on('message', async (raw) => {
        try{ 
          const msg = JSON.parse(raw);
          await notify('packet', srv, self, msg);
          if(msg.op) await notify('op', srv, self, msg);
          else if(msg.command) await notify('command', srv, self, msg);
          else if(msg.message) await notify('message', srv, self, msg);
        } catch(err) {
          console.error(err);
        }
      })
      ws.on('close', async () => {
        await notify('disconnect', srv, self);
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
