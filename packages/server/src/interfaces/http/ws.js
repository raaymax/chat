const { Server } = require('socket.io');
const sessionParser = require('./sessionParser');
const bus = require('../../infra/ws');
const actions = require('../../actions');
const corsConfig = require('./cors');

module.exports = (server) => {
  const io = new Server(server, {
    cors: corsConfig,
  });

  const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

  io.use(wrap(sessionParser));

  // only allow authenticated users
  io.use((socket, next) => {
    const { session } = socket.request;
    if (session && session.userId) {
      next();
    } else {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (ws) => {
    const { userId } = ws.client.request.session;
    function sendHandler(raw) {
      const { _opts = {}, ...msg } = raw;
      if (_opts.onlyOthers && msg.userId === userId) {
        return;
      }
      ws.send(msg);
    }
    bus.on(userId, sendHandler);

    ws.on('message', async (msg) => {
      msg.userId = userId;
      let handler = actions[msg.type];
      if (!handler) handler = actions.default;
      const wsreq = {
        type: msg.type,
        body: msg,
        userId,
        session: ws.request.session,
      };

      const wsres = {
        bus,
        broadcast: (m, opts) => bus.broadcast({
          ...m,
          seqId: msg.seqId,
          _opts: opts,
        }),
        ok: (m) => bus.direct(userId, {
          ...m,
          seqId: msg.seqId,
          type: 'response',
          status: 'ok',
        }),
        send: (m) => bus.direct(userId, {
          ...m,
          seqId: msg.seqId,
        }),
      };
      try {
        await handler(wsreq, wsres);
      } catch (err) {
        bus.direct(userId, {
          seqId: msg.seqId,
          type: 'response',
          status: 'error',
          message: err.message,
          ...err,
        });
      }
    });

    ws.on('close', () => {
      bus.off(userId, sendHandler);
    });
  });
};
