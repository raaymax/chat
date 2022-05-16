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
          login: 'melisa',
          password: genHash('123'),
          name: 'Melisa',
          avatarUrl: 'https://ca.slack-edge.com/TB72FRZKQ-U01RPU96LSV-ade06ecc19e3-512',
        },
        {
          _id: ObjectId('6255a4156c28443c92c26d7d'),
          clientId: 'c3875674-61f1-4793-a558-a733293f3527',
          login: 'mateusz',
          password: genHash('123'),
          name: 'Mateusz',
          avatarUrl: 'https://ca.slack-edge.com/TB72FRZKQ-UB5EKE23A-f9c5218dbd2e-512',
        },
      ]);
    }
  },

  async down(db) {
    return db.collection('users').deleteMany({});
  },
};
