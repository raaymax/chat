const { WebSocketServer } = require('ws');
const sessionParser = require('./sessionParser');
const bus = require('../../infra/ws');

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, req, client) => {
  function sendHandler(msg) {
    ws.send(JSON.stringify(msg));
  } 
  bus.on(client, sendHandler);
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    ws.send(JSON.stringify({
      seqId: msg.seqId,
      type: 'response',
      status: 'ok',
    }));
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
