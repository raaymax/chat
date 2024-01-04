const Joi = require('joi');
const repo = require('../../infra/repositories');
const plugins = require('../../infra/plugins');
/* eslint-disable global-require */

const actions = [
  require('./pingSend'),

  ...require('./command'),
  ...require('./message'),
  ...require('./channel'),
  ...require('./emoji'),
  ...require('./user'),
  ...require('./readReceipt'),

  ...plugins.get('actions'),
  {
    type: 'default',
    handler: (req) => {
      const err = new Error('Unknown action');
      err.action = req.type;
      throw err;
    },
  },
].map((module) => ({
  [module.type]: module,
})).reduce((acc, item) => ({ ...acc, ...item }), {});

const dispatch = async ({ type, seqId, ...body }, { userId, bus, push = () => {} }) => {
  let handler = actions[type];
  if (!handler) handler = actions.default;
  const wsreq = {
    type,
    body,
    userId,
  };

  const wsres = {
    bus,
    push,
    group: (userIds, m, opts) => bus.group(userIds, {
      ...m,
      seqId,
      _opts: opts,
    }),
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

  const srv = {
    repo,
    bus,
    push,
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
      const { error: uerr } = await Joi.string().required().validate(wsreq.userId);
      if (uerr) throw uerr;
      await service.user.setLastSeen({ userId }, { bus });
      await handler.handler(wsreq, wsres, srv);
    }
  } catch (err) {
    if (!(err instanceof Joi.ValidationError)) {
      // eslint-disable-next-line no-console
      // console.error(err); // maybe attach logger
    }
    bus.direct(userId, {
      seqId,
      type: 'response',
      status: 'error',
      message: err.message,
      stack: err.stack,
      ...err,
    });
  }
};

module.exports = { dispatch };
