/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const cursor = await db.collection('messages').aggregate([{ $group: { _id: '$clientId', count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }]);
    for await (const fixItem of cursor) {
      await db.collection('messages').updateMany(
        { clientId: {$eq: fixItem._id} },
        [{
          $set: {
            clientId: {
              $function: {
                body: `function() {return 'temp:' + (Math.random() + 1); }`,
                args: [],
                lang: 'js',
              },
            },
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
