const Joi = require('joi');
const db = require('../../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

module.exports = {
  type: 'updateProgress',
  schema: {
    body: Joi.object({
      messageId: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    if (!msg.messageId) throw MissingChannel(); // FIXME

    const message = await db.message.get({ id: msg.messageId });
    const { channelId, parentId = null } = message;

    if (!await ChannelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    await db.badge.upsert({
      userId: req.userId,
      channelId,
      parentId,
      lastMessageId: msg.messageId,
      lastRead: message.createdAt,
      count: await db.message.count({
        after: new Date(new Date(message.createdAt).getTime() + 1),
        channelId,
        parentId,
      }),
    });

    const myProgress = await db.badge.get({ channelId, parentId, userId: req.userId });
    res.broadcast({ type: 'badge', ...myProgress });
    res.ok({ });
  },
};