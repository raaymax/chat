module.exports = {
  async up(db) {
    db.collection('users').updateMany({ login: { $in: ['system', 'openai', 'bob'] } }, { $set: { system: true } });
  },

  async down(db) {
    db.collection('users').updateMany({ login: { $in: ['system', 'openai', 'bob'] } }, { $unset: { system: true } });
  },
};
