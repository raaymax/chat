const { Server } = require('socket.io');
const bus = require('../../infra/bus');
const actions = require('../../app/actions');
const corsConfig = require('./cors');
const { push } = require('../../infra/webpush');
const sess = require('./session');

module.exports = (server) => {
  const io = new Server(server, {
    cors: corsConfig,
  });

  // only allow authenticated users
  io.use(async (socket, next) => {
    const session = await sess.getSession(socket.handshake);
    if (!session) {
      return next(new Error('unauthorized'));
    }
    socket.request.session = session;
    return next();
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

    ws.on('message', async (msg) => actions.dispatch(msg, { userId, bus, push }));

    ws.on('close', () => {
      bus.off(userId, sendHandler);
    });
    ws.on('disconnect', () => {
      bus.off(userId, sendHandler);
    });
  });
};
