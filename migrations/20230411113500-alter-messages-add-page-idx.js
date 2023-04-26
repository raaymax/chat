/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const idxs = {};
    const docs = await db.collection('messages').find({});
    for await (const doc of docs) {
      const idxKey = `${doc.channelId}:${doc.parentId ? doc.parentId : 'null'}`;
      idxs[idxKey] = idxs[idxKey] ? idxs[idxKey] + 1 : 1;
      await db.collection('messages').updateOne({ _id: doc._id }, { $set: { streamIdx: idxs[idxKey] } });
    }

    Object.keys(idxs).forEach(async (key) => {
      await db.collection('stream_indexes').insertOne({ _id: key, idx: idxs[key] });
    });
  },

  async down() {
    // empty
  },
};
