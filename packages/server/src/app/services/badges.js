const db = require('../../infra/database');
const bus = require('../../infra/ws');

module.exports = {
  messageSent: async (channelId, messageId, userId) => {
    const message = await db.message.get({ id: messageId });
    await db.badge.increment({ channelId });
    await db.badge.reset({ channelId, userId });
    await db.badge.upsert({
      userId,
      channelId,
      lastMessageId: messageId,
      lastRead: message.createdAt,
      count: 0,
    });
    const badge = await db.badge.get({ channelId, userId });
    bus.broadcast({ type: 'badge', ...badge });
  },
};
