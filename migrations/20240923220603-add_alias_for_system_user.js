module.exports = {
  async up(db, client) {
    await db.collection('users').updateOne({ login: 'system' }, { $set: { alias: 'system' } });
  },

  async down(db, client) {
    await db.collection('users').updateOne({ login: 'system' }, { $unset: { alias: true } });
  },
};
