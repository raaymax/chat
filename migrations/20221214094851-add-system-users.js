module.exports = {
  async up(db) {
    db.collection('users').insertMany([
      {
        login: 'system',
        name: 'System',
        avatarUrl: '/icon.png',
      },
    ]);
  },

  async down(db) {
    await db.collection('users').deleteOne({ login: 'system' });
  },
};
