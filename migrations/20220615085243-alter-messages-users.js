/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const docs = await db.collection('messages').find({ userId: { $exists: false } });
    for await (const doc of docs) {
      console.log(doc, doc.user.id);
      await db.collection('messages').updateOne({ _id: doc._id }, { $set: {userId: doc.user?.id} });
    }
  },

  async down() {
    // empty
  },
};
