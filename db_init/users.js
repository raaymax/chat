
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const genHash = (data) => bcrypt.hashSync(data, 10);

module.exports = {
  async up(db) {
    await db.collection('users').insertMany([
      {
        _id: new ObjectId('6255a4156c28443c92c26d7e'),
        clientId: '7ed5c52c-35f8-4a27-929d-ff5eb1a74924',
        login: 'admin',
        password: genHash('123'),
        name: 'Admin',
        avatarUrl: '',
      },
      {
        _id: new ObjectId('6255a4156c28443c92c26d7d'),
        clientId: 'c3875674-61f1-4793-a558-a733293f3527',
        login: 'member',
        password: genHash('123'),
        name: 'Member',
        avatarUrl: '',
      },
      {
        login: 'system',
        name: 'System',
        avatarUrl: 'https://chat.codecat.io/assets/icon.png',
      },
    ]);
  },
};
