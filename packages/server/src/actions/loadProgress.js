const Joi = require('joi');
const db = require('../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

module.exports = {
  type: 'loadProgress',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    if (!msg.channelId) throw MissingChannel();
    const channel = await db.channel.get({ id: msg.channelId });

    if (!await ChannelHelper.haveAccess(req.userId, channel.cid)) {
      throw AccessDenied();
    }
    const badges = await db.badge.getAll({ channelId: channel.id });
    badges.forEach((badge) => res.send({ type: 'badge', ...badge }));
    res.ok({ count: badges.length });
  },
};
