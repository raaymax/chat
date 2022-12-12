const Joi = require('joi');
const db = require('../../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

module.exports = {
  type: 'load',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      pinned: Joi.string().optional(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      limit: Joi.number().optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    const { channelId } = msg;

    if (!channelId) throw MissingChannel();

    if (!await ChannelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    const msgs = await db.message.getAll({
      channelId,
      before: msg.before,
      after: msg.after,
      ...(msg.pinned ? { pinned: msg.pinned } : {}),
    }, { limit: msg.limit, order: msg.after ? 1 : -1 });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({ count: msgs.length });
  },
};
