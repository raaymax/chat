/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const cursor = await db.collection('channels').aggregate([{ $group: { _id: '$cid', count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }]);
    for await (const fixItem of cursor) {
      await db.collection('channels').deleteMany({ cid: fixItem._id });
    }
    return db.collection('channels').createIndex({ cid: 1 }, { unique: true });
  },

  async down(db) {
    return db.collection('channels').createIndex({ cid: 1 }, { unique: false });
  },
};
