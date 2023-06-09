const repo = require('../../infra/repositories');

module.exports = {

  create: async ({
    channelType, name, userId, users, ...rest
  }, { bus } = {}) => {
    if (channelType === 'PUBLIC' || channelType === 'PRIVATE') {
      const existing = await repo.channel.get({ name, userId });
      if (existing) {
        return existing.id;
      }
    }

    const channelId = await repo.channel.create({
      name,
      userId,
      channelType,
      private: (channelType === 'PRIVATE' || channelType === 'DIRECT'),
      direct: (channelType === 'DIRECT'),
      users: (channelType === 'DIRECT' ? [userId, ...users] : [userId]),
      ...rest,
    });

    if (bus) {
      const channel = await repo.channel.get({ id: channelId });
      bus.broadcast({ type: 'channel', ...channel });
    }

    return channelId;
  },

  join: async (id, userId) => {
    const channel = await repo.channel.get({ id });
    if (channel) {
      channel.users.push(userId);
      await repo.channel.update({ id }, { users: channel.users });
      return id;
    }
    return null;
  },

  leave: async (id, userId) => {
    const channel = await repo.channel.get({ id, userId });
    if (channel) {
      await repo.channel.update({ id }, { users: channel.users.filter((user) => user !== userId) });
      return id;
    }
    return null;
  },
};
