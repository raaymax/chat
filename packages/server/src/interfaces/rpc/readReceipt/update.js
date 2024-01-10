const Joi = require('joi');
const { MissingChannel, AccessDenied } = require('../../common/errors');
const ChannelHelper = require('../../common/channel');

module.exports = {
  type: 'readReceipt:update',
  schema: {
    body: Joi.object({
      messageId: Joi.string().required(),
    }),
  },
  handler: async (req, res, {repo, services}) => {
    const msg = req.body;

    if (!msg.messageId) throw MissingChannel(); // FIXME

    const message = await repo.message.get({ id: msg.messageId });
    const { channelId, parentId = null } = message;

    if (!await ChannelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    await services.badge.upsert({
      userId: req.userId,
      channelId,
      parentId,
      lastMessageId: msg.messageId,
      lastRead: message.createdAt,
      count: await repo.message.count({
        after: new Date(new Date(message.createdAt).getTime() + 1),
        channelId,
        parentId,
      }),
    });

    const myProgress = await repo.badge.get({ channelId, parentId, userId: req.userId });
    const channel = await repo.channel.get({ id: channelId });
    res.group(channel.users, { type: 'badge', ...myProgress });
    res.ok({ });
  },
};
