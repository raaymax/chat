const { WebSocketServer } = require('ws');
const sessionParser = require('./sessionParser');
const bus = require('../../infra/ws');
const actions = require('../../actions');

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, req, client) => {
  function sendHandler(msg) {
    if(msg.target === 'broadcast' && msg.userId === client) return;
    ws.send(JSON.stringify(msg));
  } 
  bus.on(client, sendHandler);


  ws.on('message', async (data) => {
    const msg = JSON.parse(data);
    let handler = actions[msg.type];
    if(!handler) handler = actions['default'];
    const wsreq = {
      type: msg.type,
      body: msg,
      userId: client,
      session: req.session
    }

    const wsres = {
      bus,
      ok: (m) => bus.direct(client, {
        seqId: msg.seqId,
        type: 'response',
        status: 'ok', 
        ...m,
      }),
      send: (m) => bus.direct(client, {
        seqId: msg.seqId,
        type: 'response',
        ...m
      })
    }
    try{ 
      await handler(wsreq, wsres);
    }catch(err){
      bus.direct(client, {
        seqId: msg.seqId,
        type: 'response',
        status: 'error',
        message: err.message,
      })

    }
  });
  ws.on('close', () => {
    bus.off(client, sendHandler);
  })
});

function authenticate(req, next) {
  if(req.session.userId) return next(null, req.session.userId);
  return next('error');
}

module.exports = server => {
  server.on('upgrade', (req, socket, head) => {
    sessionParser(req, {}, () => {
      authenticate(req, (err, client) => {
        if (err || !client) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        wss.handleUpgrade(req, socket, head, function done(ws) {
          wss.emit('connection', ws, req, client);
        });
      });

    });
  });
}
