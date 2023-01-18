module.exports = {
  async up(db) {
    db.collection('users').insertMany([
      {
        login: 'system',
        name: 'System',
        avatarUrl: 'https://chat.codecat.io/assets/icon.png',
      },
      {
        login: 'openai',
        name: 'OpenAI',
        avatarUrl: 'https://chat.codecat.io/assets/openai.png',
      },
      {
        login: 'bob',
        name: 'Bob',
        avatarUrl: 'https://chat.codecat.io/assets/bob.png',
      },
    ]);
  },

  async down(db) {
    await db.collection('users').deleteOne({ login: 'system' });
    await db.collection('users').deleteOne({ login: 'openai' });
    await db.collection('users').deleteOne({ login: 'bob' });
  },
};
