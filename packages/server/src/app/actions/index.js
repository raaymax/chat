const Joi = require('joi');
/* eslint-disable global-require */

const actions = [
  require('./pingSend'),
  require('./fcmSetup'),

  require('./messageSend'),
  require('./messageRemove'),
  require('./messageUpdate'),
  require('./messagesLoad'),
  require('./messagesSearch'),
  require('./messagesPins'),
  require('./messagePin'),

  require('./channelsLoad'),
  require('./channelFind'),
  require('./channelCreate'),

  require('./typingSend'),
  require('./greetSend'),
  require('./reactionSend'),
  require('./commandExecute'),
  require('./configGet'),
  require('./usersLoad'),

  require('./emojiFind'),
  require('./emojisLoad'),

  require('./progressLoad'),
  require('./progressUpdate'),

  require('./badgesLoad'),
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
      const { error: uerr } = await Joi.string().required().validate(wsreq.userId);
      if (uerr) throw uerr;
      await handler.handler(wsreq, wsres);
    }
  } catch (err) {
    // console.error(err); // maybe attach logger
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
