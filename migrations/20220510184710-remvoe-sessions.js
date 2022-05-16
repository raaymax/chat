module.exports = {
  async up(db) {
    return db.collection('sessions').deleteMany({});
  },

  async down() {
    // empty
  },
};
