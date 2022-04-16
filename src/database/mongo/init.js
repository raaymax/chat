const { db } = require('./db');

const { genHash } = require('../../tools');

module.exports = async () => {
  try {
    if (await (await db).collection('users').countDocuments() === 0) {
      await (await db).collection('users').insertMany([
        {
          clientId: '7ed5c52c-35f8-4a27-929d-ff5eb1a74924',
          login: 'melisa',
          password: genHash('123'),
          name: 'Melisa',
          avatarUrl: 'https://ca.slack-edge.com/TB72FRZKQ-U01RPU96LSV-ade06ecc19e3-512',
        },
        {
          clientId: 'c3875674-61f1-4793-a558-a733293f3527',
          login: 'mateusz',
          password: genHash('123'),
          name: 'Mateusz',
          avatarUrl: 'https://ca.slack-edge.com/TB72FRZKQ-UB5EKE23A-f9c5218dbd2e-512',
        },
      ]);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
