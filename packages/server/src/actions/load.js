const Joi = require('joi');
const { messageRepo } = require('../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const channel = require('../common/channel');

module.exports = {
  type: 'load',
  schema: {
    body: Joi.object({
      channel: Joi.string().required(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      limit: Joi.number().optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    console.log(msg);

    if (!msg.channel) throw MissingChannel();

    if (!await channel.haveAccess(req.userId, msg.channel)) {
      throw AccessDenied();
    }
    const msgs = await messageRepo.getAll({
      channel: msg.channel,
      before: msg.before,
      after: msg.after,
    }, { limit: msg.limit });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({ count: msgs.length });
  },
};
