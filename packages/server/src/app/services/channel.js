const repo = require('../../infra/repositories');

module.exports = {

  create: async (name, userId) => {
    const channel = await repo.channel.get({ name, userId });
    if (channel) {
      return channel.id;
    }

    return repo.channel.create({ name, users: [userId] }).then(({ id }) => id);
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
