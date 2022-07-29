/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const cursor = await db.collection('messages').find({});
    for await (const fixItem of cursor) {
      await db.collection('messages').updateOne(
        { clientId: { $eq: fixItem._id } },
        [{
          $set: {
            clientId: `temp:${Math.random() + 1}`,
          },
        }],
      );
    }
    return db.collection('messages').createIndex({ clientId: 1 }, { unique: true });
  },

  async down(db) {
    return db.collection('messages').createIndex({ clientId: 1 }, { unique: true });
  },
};
