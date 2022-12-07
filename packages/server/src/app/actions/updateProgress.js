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
    const channel = await db.channel.get({ cid: message.channel });

    if (!await ChannelHelper.haveAccess(req.userId, channel.cid)) {
      throw AccessDenied();
    }
    await db.badge.upsert({
      userId: req.userId,
      channelId: channel.id,
      lastMessageId: msg.messageId,
      lastRead: message.createdAt,
      count: await db.message.count({ after: message.createdAt, channel: channel.cid }),
    });

    const myProgress = await db.badge.get({ channelId: channel.id, userId: req.userId });
    res.broadcast({ type: 'badge', ...myProgress });
    res.ok({ });
  },
};
