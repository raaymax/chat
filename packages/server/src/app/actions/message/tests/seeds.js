const api = require('../../tests/api');

module.exports = {
  run: async () => {
    const member = await api.repo.user.get({ login: 'member' });
    const admin = await api.repo.user.get({ login: 'admin' });
    const channel = await api.repo.channel.get({ name: 'main' });
    let deniedChannel = await api.repo.channel.get({ name: 'denied' });
    if (!deniedChannel) {
      const id = await api.repo.channel.create({ name: 'denied', private: true, users: [] });
      deniedChannel = await api.repo.channel.get({ id });
    }
    const testChannel = await api.repo.channel.get({ name: 'test' });
    if (!testChannel) await api.repo.channel.create({ name: 'test', private: false });
    const {db} = await api.repo.connect();
    db.collection('messages').deleteMany({});
    await api.repo.badge.removeMany({});
    await api.repo.message.createMany([
      {
        clientId: 1,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel.id,
        flat: 'Hello',
        userId: member.id,
        createdAt: new Date('2022-01-01'),
      },
      {
        clientId: 2,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel.id,
        flat: 'Hello',
        pinned: true,
        userId: admin.id,
        createdAt: new Date('2022-01-02'),
      },
      {
        clientId: 3,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel.id,
        flat: 'Hello',
        pinned: true,
        userId: member.id,
        createdAt: new Date('2022-01-03'),
      },
      {
        clientId: 4,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel.id,
        flat: 'Hello',
        userId: admin.id,
        createdAt: new Date('2022-01-04'),
      },
      {
        clientId: 5,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel.id,
        flat: 'Hello',
        userId: member.id,
        createdAt: new Date('2022-01-05'),
      },
      {
        clientId: 6,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: deniedChannel.id,
        pinned: true,
        flat: 'Hello',
        userId: member.id,
        createdAt: new Date('2022-01-06'),
      },
    ]);
  },
};
