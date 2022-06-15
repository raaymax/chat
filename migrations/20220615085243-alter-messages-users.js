/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const docs = await db.collection('messages').find({ $or: [{ userId: { $exists: false } }, { userId: undefined }] });
    for await (const doc of docs) {
      console.log(doc, doc.user.id);
      await db.collection('messages').updateOne({ _id: doc._id }, { $set: { userId: doc.user?.id } });
      if (!doc.user.id && doc.user.name === 'OpenAI') {
        await db.collection('messages').updateOne({ _id: doc._id }, { $set: { userId: 'openai' } });
      }
    }
  },

  async down() {
    // empty
  },
};
