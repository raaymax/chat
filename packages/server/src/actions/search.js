const Joi = require('joi');
const { messageRepo } = require('../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const channel = require('../common/channel');

module.exports = {
  type: 'search',
  schema: {
    body: Joi.object({
      channel: Joi.string().required(),
      text: Joi.string().required(),
      limit: Joi.number().optional().default(100),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    if (!msg.channel) throw MissingChannel();

    if (!await channel.haveAccess(req.userId, msg.channel)) {
      throw AccessDenied();
    }
    const msgs = await messageRepo.getAll({
      $text: { $search: msg.text },
      channel: msg.channel,
      before: msg.before,
    }, { limit: msg.limit });

    msgs.forEach((m) => res.send({ type: 'search', ...m }));
    res.ok({ count: msgs.length });
  },
};
