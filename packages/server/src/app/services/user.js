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

  create: async ({name, login, password}, { bus }) => {
    const existing = await repo.user.get({ login });
    if (existing) throw new Error('Login already exists');

    const userId = await repo.user.create({
      name,
      login,
      password: bcrypt.hashSync(password, 10),
    });

    const channelId = await repo.channel.create({
      cid: userId,
      private: true,
      name,
      users: [userId],
    });

    await repo.user.update({ id: userId }, { mainChannelId: channelId });
    
    return userId;
  },

  connect: async (user1Id, user2Id) => {
    const channelId = await repo.channel.create({
      direct: true,
      private: true,
      name: 'Direct',
      users: [user1Id, user2Id],
    });

    return channelId;
  }
};

module.exports = UserService;
