const { EventEmitter } = require('events');

const bus = new EventEmitter();
bus.setMaxListeners(100);

module.exports = {
  direct: (userId, msg) => bus.emit(userId, { ...msg, target: 'direct' }),
  broadcast: (msg) => bus.emit('all', { ...msg, target: 'broadcast' }),
  on: (userId, cb) => {
    bus.on(userId, cb);
    bus.on('all', cb);
  },
  off: (userId, cb) => {
    bus.off(userId, cb);
    bus.off('all', cb);
  },
};

module.exports = {
  dispatch,
  register,
};

const ws = {};

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
