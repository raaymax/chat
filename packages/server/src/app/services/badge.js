const repo = require('../../infra/repositories');
const bus = require('../../infra/bus');

const Service = {
  upsert: async ({
    channelId, parentId, userId, lastRead, ...data
  }) => {
    const progress = await repo.badge.get({ channelId, parentId, userId });
    if (progress && progress.lastRead > lastRead) return;

    if (!progress) {
      await repo.badge.create({
        count: 0, channelId, parentId, userId, lastRead, ...data,
      });
    } else {
      await repo.badge.update({ id: progress.id }, {
        lastRead, ...data,
      });
    }
  },
  messageSent: async (channelId, parentId, messageId, userId) => {
    const message = await repo.message.get({ id: messageId });
    if (!message) {
      // eslint-disable-next-line no-console
      console.debug('messageSent: message not found', messageId);
      return;
    }
    await repo.badge.increment({ channelId, parentId });
    const other = await repo.badge.getAll({ channelId, parentId });
    other.filter((badge) => badge.userId !== userId).forEach((badge) => {
      bus.direct(badge.userId, { type: 'badge', ...badge });
    });
    await Service.upsert({
      userId,
      channelId,
      parentId,
      lastMessageId: messageId,
      lastRead: message.createdAt,
      count: 0,
    });
    const badge = await repo.badge.get({ channelId, parentId, userId });
    bus.broadcast({ type: 'badge', ...badge });
  },
};

module.exports = Service;
