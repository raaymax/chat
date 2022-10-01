const { db } = require('../../src/infra/database');

module.exports = {
  run: async () => {
    const melisa = (await db).collection('users').findOne({ login: 'melisa' });
    const mateusz = (await db).collection('users').findOne({ login: 'mateusz' });
    await (await db).collection('messages').deleteMany({});
    await (await db).collection('messages').insertMany([
      {
        clientId: 1,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        flat: 'Hello',
        userId: melisa.id,
        createdAt: new Date('2022-01-01'),
      },
      {
        clientId: 2,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        flat: 'Hello pinned',
        pinned: true,
        userId: mateusz.id,
        createdAt: new Date('2022-01-02'),
      },
      {
        clientId: 3,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        flat: 'Hello',
        userId: melisa.id,
        createdAt: new Date('2022-01-03'),
      },
      {
        clientId: 4,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        flat: 'Hello',
        userId: mateusz.id,
        createdAt: new Date('2022-01-04'),
      },
      {
        clientId: 5,
        message: { line: { text: 'Hello' } },
        channel: 'main',
        flat: 'Hello',
        userId: melisa.id,
        createdAt: new Date('2022-01-05'),
      },
    ]);
  },
};
