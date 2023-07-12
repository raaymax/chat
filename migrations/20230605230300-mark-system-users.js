module.exports = {
  async up(db) {
    db.collection('users').updateMany({ login: { $in: ['system'] } }, { $set: { system: true } });
  },

  async down(db) {
    db.collection('users').updateMany({ login: { $in: ['system'] } }, { $unset: { system: true } });
  },
};
