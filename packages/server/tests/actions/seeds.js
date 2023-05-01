const { db } = require('../../src/infra/repositories');

module.exports = {
  run: async () => {
    const member = (await db).collection('users').findOne({ login: 'member' });
    const admin = (await db).collection('users').findOne({ login: 'admin' });
    const channel = await (await db).collection('channels').findOne({ name: 'main' });
    const testChannel = await (await db).collection('channels').findOne({ name: 'test' });
    if (!testChannel) await (await db).collection('channels').insertOne({ name: 'test', private: false });
    await (await db).collection('messages').deleteMany({});
    await (await db).collection('badges').deleteMany({});
    await (await db).collection('messages').insertMany([
      {
        clientId: 1 + (`${Math.random()}`).slice(2),
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel._id,
        flat: 'Hello',
        userId: member.id,
        createdAt: new Date('2022-01-01'),
      },
      {
        clientId: 2 + (`${Math.random()}`).slice(2),
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel._id,
        flat: 'Hello pinned',
        pinned: true,
        userId: admin.id,
        createdAt: new Date('2022-01-02'),
      },
      {
        clientId: 3 + (`${Math.random()}`).slice(2),
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel._id,
        flat: 'Hello',
        userId: member.id,
        createdAt: new Date('2022-01-03'),
      },
      {
        clientId: 4 + (`${Math.random()}`).slice(2),
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel._id,
        flat: 'Hello',
        userId: admin.id,
        createdAt: new Date('2022-01-04'),
      },
      {
        clientId: 5 + (`${Math.random()}`).slice(2),
        message: { line: { text: 'Hello' } },
        channel: 'main',
        channelId: channel._id,
        flat: 'Hello',
        userId: member.id,
        createdAt: new Date('2022-01-05'),
      },
    ]);
  },
};
