const crypto = require('crypto');
const { ObjectId } = require('mongodb');

const genHash = (data) => crypto.createHash('sha256').update(data).digest('hex');

module.exports = {
  async up(db) {
    if (await db.collection('users').countDocuments() === 0) {
      await db.collection('users').insertMany([
        {
          _id: ObjectId('6255a4156c28443c92c26d7e'),
          clientId: '7ed5c52c-35f8-4a27-929d-ff5eb1a74924',
          login: 'admin',
          password: genHash('test123#@!'),
          name: 'Admin',
          avatarUrl: '',
        },
      ]);
    }
  },

  async down(db) {
    return db.collection('users').deleteMany({});
  },
};
