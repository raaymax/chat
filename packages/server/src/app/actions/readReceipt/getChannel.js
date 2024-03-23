const Joi = require('joi');
const repo = require('../../../infra/repositories');
const { MissingChannel, AccessDenied } = require('../../common/errors');
const ChannelHelper = require('../../common/channel');

module.exports = {
  type: 'readReceipt:getChannel',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      parentId: Joi.string().optional().allow(null).default(null),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    if (!msg.channelId) throw MissingChannel();
    const channel = await repo.channel.get({ id: msg.channelId });

    if (!await ChannelHelper.haveAccess(req.userId, channel?.id)) {
      throw AccessDenied();
    }
    const badges = await repo.badge.getAll({ channelId: channel.id, parentId: msg.parentId });
    badges.forEach((badge) => res.send({ type: 'badge', ...badge }));
    res.ok({ count: badges.length });
  },
};
