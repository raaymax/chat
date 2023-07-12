const repo = require('../../infra/repositories');
const tools = require('../tools');

const locks = {};

const UserService = {
  setLastSeen: async ({ userId }, { bus } = {}) => {
    if (!userId || locks[userId]) return undefined;
    locks[userId] = true;
    const user = await repo.user.get({ id: userId });
    if (!user) {
      return undefined;
    }

    await repo.user.update({ id: userId }, { lastSeen: new Date() });

    await UserService.broadcastUser({ userId }, { bus });

    setTimeout(() => {
      locks[userId] = false;
    }, 2000);
    return userId;
  },

  broadcastUser: async ({ userId }, { bus } = {}) => {
    if (!userId) return undefined;
    if (bus) {
      const updated = await repo.user.get({ id: userId });
      bus.broadcast({
        type: 'user',
        id: updated.id,
        name: updated.name,
        lastSeen: updated.lastSeen,
        system: updated.system,
        avatarUrl: tools.createImageUrl(updated.avatarFileId),
        connected: bus.hasKey(userId),
      });
    }

    return userId;
  },
};

module.exports = UserService;
