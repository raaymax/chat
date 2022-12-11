const Joi = require('joi');
const db = require('../../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const channelHelper = require('../common/channel');

module.exports = {
  type: 'pins',
  schema: {
    body: Joi.object({
      channel: Joi.string().required(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      limit: Joi.number().optional().default(10),
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
      pinned: true,
      channelId: channel.id,
      before: msg.before,
      after: msg.after,
    }, { limit: msg.limit });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({ count: msgs.length });
  },
};
