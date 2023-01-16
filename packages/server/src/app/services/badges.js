const db = require('../../infra/database');
const bus = require('../../infra/bus');

module.exports = {
  messageSent: async (channelId, parentId, messageId, userId) => {
    const message = await db.message.get({ id: messageId });
    if (!message) {
      // eslint-disable-next-line no-console
      console.debug('messageSent: message not found', messageId);
      return;
    }
    await db.badge.increment({ channelId, parentId });
    const other = await db.badge.getAll({ channelId, parentId });
    other.filter((badge) => badge.userId !== userId).forEach((badge) => {
      bus.direct(badge.userId, { type: 'badge', ...badge });
    });
    await db.badge.upsert({
      userId,
      channelId,
      parentId,
      lastMessageId: messageId,
      lastRead: message.createdAt,
      count: 0,
    });
    const badge = await db.badge.get({ channelId, parentId, userId });
    bus.broadcast({ type: 'badge', ...badge });
  },
};
