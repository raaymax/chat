
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
      password: bcrypt.hashSync(password, 10),
    });

    const channelId = await repo.channel.create({
      cid: userId,
      private: true,
      name,
      users: [userId],
    }, { bus });

    await repo.user.update({ id: userId }, { mainChannelId: channelId });

    await repo.channel.create({
      direct: true,
      private: true,
      name: 'Direct',
      users: [userId, invitation.userId],
    }, { bus });

    await repo.invitation.remove({ token });
    return userId;
  },
};
