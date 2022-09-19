/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    return db.collection('messages').createIndex({ flat: 'text' });
  },

  async down(db) {
    return db.collection('messages').createIndex({ flat: 'text' });
  },
};
