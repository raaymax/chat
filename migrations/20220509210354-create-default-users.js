const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const genHash = (data) => bcrypt.hashSync(data, 10);

module.exports = {
  async up(db) {
    if (await db.collection('users').countDocuments() === 0) {
      await db.collection('users').insertMany([
        {
          _id: ObjectId('6255a4156c28443c92c26d7e'),
          clientId: '7ed5c52c-35f8-4a27-929d-ff5eb1a74924',
          login: 'admin',
          password: genHash('123'),
          name: 'Admin',
          avatarUrl: '',
        },
        {
          _id: ObjectId('6255a4156c28443c92c26d7d'),
          clientId: 'c3875674-61f1-4793-a558-a733293f3527',
          login: 'member',
          password: genHash('123'),
          name: 'Member',
          avatarUrl: '',
        },
      ]);
    }
  },

  async down(db) {
    return db.collection('users').deleteMany({});
  },
};
