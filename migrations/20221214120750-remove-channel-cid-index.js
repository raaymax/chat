 
module.exports = {
  async up(db) {
    return db.collection('channels').dropIndex({ cid: 1 });
  },

  async down(db) {
    const cursor = await db.collection('channels').aggregate([{ $group: { _id: '$cid', count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }]);
    for await (const fixItem of cursor) {
      await db.collection('channels').deleteMany({ cid: fixItem._id });
    }
    return db.collection('channels').createIndex({ cid: 1 }, { unique: true });
  },
};
