const Joi = require('joi');

module.exports = {
  type: 'user:push:subscribe',
  schema: {
    body: Joi.object({
      endpoint: Joi.string().required(),
      expirationTime: Joi.string().allow(null).optional(), // TODO: make use of it
      keys: Joi.object({
        auth: Joi.string().required(),
        p256dh: Joi.string().required(),
      }).required(),
    }),
  },
  handler: async (req, res, {repo}) => {
    const msg = req.body;
    await repo.user.update({ id: req.userId }, {
      webPush: {
        [msg.endpoint]: {
          endpoint: msg.endpoint,
          keys: {
            auth: msg.keys.auth,
            p256dh: msg.keys.p256dh,
          },
        },
      },
    }, 'set');

    return res.ok();
  },
};
