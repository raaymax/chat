const db = require('../../infra/database');

module.exports = {

  create: async (name, userId) => {
    const channel = await db.channel.get({ name, userId });
    if (channel) {
      return channel.id;
    }

    return db.channel.create({ name, users: [userId] }).then(({ id }) => id);
  },

  join: async (id, userId) => {
    const channel = await db.channel.get({ id });
    if (channel) {
      channel.users.push(userId);
      await db.channel.update({ id }, { users: channel.users });
      return id;
    }
    return null;
  },

  leave: async (id, userId) => {
    const channel = await db.channel.get({ id, userId });
    if (channel) {
      await db.channel.update({ id }, { users: channel.users.filter((user) => user !== userId) });
      return id;
    }
    return null;
  },
};
