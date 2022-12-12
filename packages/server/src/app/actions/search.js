const Joi = require('joi');
const db = require('../../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const channelHelper = require('../common/channel');

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

    const channel = await db.channel.get({ cid: msg.channel });
    if (!await channelHelper.haveAccess(req.userId, msg.channel)) {
      throw AccessDenied();
    }
    const msgs = await db.message.getAll({
      $text: { $search: msg.text },
      channelId: channel.id,
      before: msg.before,
    }, { limit: msg.limit });

    msgs.forEach((m) => res.send({ type: 'search', ...m }));
    res.ok({ count: msgs.length });
  },
};
