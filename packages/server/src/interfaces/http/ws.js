const { Server } = require('socket.io');
const sessionParser = require('./sessionParser');
const db = require('../../infra/repositories');
const bus = require('../../infra/bus');
const actions = require('../../app/actions');
const corsConfig = require('./cors');
const firebase = require('../../infra/firebase');

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

    ws.on('message', async (msg) => actions.dispatch(msg, { userId, bus, push: (...args) => firebase.push(...args) }));

    ws.on('close', () => {
      bus.off(userId, sendHandler);
    });
  });
};
