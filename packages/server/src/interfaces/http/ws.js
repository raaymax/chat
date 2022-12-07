const { Server } = require('socket.io');
const sessionParser = require('./sessionParser');
const db = require('../../infra/database');
const bus = require('../../infra/ws');
const actions = require('../../app/actions');
const corsConfig = require('./cors');

module.exports = (server) => {
  const io = new Server(server, {
    cors: corsConfig,
  });

  const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

  io.use(wrap(sessionParser));

  // only allow authenticated users
  io.use(async (socket, next) => {
    const { session } = socket.request;
    if (session?.userId) {
      next();
    } else {
      const token = socket.handshake?.auth?.token;
      if (token) {
        const record = await db.session.getByToken(token);
        if (record?.session?.userId) {
          record.session.save = async () => {
            const { save, ...data } = record.session;
            return db.session.update(record.id, { session: data });
          };
          socket.request.session = record.session;
          return next();
        }
      }
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

    ws.on('message', async ({ type, seqId, ...body }) => {
      let handler = actions[type];
      if (!handler) handler = actions.default;
      const wsreq = {
        type,
        body,
        userId,
        session: ws.request.session,
      };

      const wsres = {
        bus,
        broadcast: (m, opts) => bus.broadcast({
          ...m,
          seqId,
          _opts: opts,
        }),
        ok: (m) => bus.direct(userId, {
          ...m,
          seqId,
          type: 'response',
          status: 'ok',
        }),
        send: (m) => bus.direct(userId, {
          ...m,
          seqId,
        }),
      };
      try {
        if (typeof handler === 'function') {
          await handler(wsreq, wsres);
        } else {
          if (handler.schema?.body) {
            const { value, error } = await handler.schema.body
              .validate(wsreq.body, { stripUnknown: true });
            if (error) throw error;
            wsreq.body = value;
          }
          await handler.handler(wsreq, wsres);
        }
      } catch (err) {
        bus.direct(userId, {
          seqId,
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
