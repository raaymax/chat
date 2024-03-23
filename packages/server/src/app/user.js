const bcrypt = require('bcrypt');
const repo = require('../infra/repositories');
const bus = require('../infra/bus');

module.exports = {
  login: async (login, password) => {
    const user = await repo.user.get({ login });
    if (!user) return null;
    return bcrypt.compareSync(password, user.password) ? user : null;
  },

  create: async ({
    name, login, password, token,
  }) => {
    const invitation = await repo.invitation.get({ token });
    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    const existing = await repo.user.get({ login });
    if (existing) throw new Error('Login already exists');

    const userId = await repo.user.create({
      name,
      login,
      avatarUrl: '/avatar.png',
      password: bcrypt.hashSync(password, 10),
    });

    const channelId = await repo.channel.create({
      cid: userId,
      private: true,
      direct: true,
      name,
      channelType: 'DIRECT',
      users: [userId],
    }, { bus });

    await repo.user.update({ id: userId }, { mainChannelId: channelId });

    await repo.channel.create({
      direct: true,
      private: true,
      name: 'Direct',
      channelType: 'DIRECT',
      users: [userId, invitation.userId],
    }, { bus });

    await repo.invitation.remove({ token });
    return userId;
  },

  firstLogin: async (userId) => {
    const user = await repo.user.get({ id: userId });
    if (!user) return null;
    return user.password === bcrypt.hashSync('123', 10);
  },
};
