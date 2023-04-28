/* eslint-disable no-restricted-syntax */
module.exports = {
  async up(db) {
    const cursor = await db.collection('messages')
      .find({ parentId: { $exists: false } });
    while (await cursor.hasNext()) {
      const message = await cursor.next();
      await db.collection('messages')
        .updateOne({ _id: message._id }, {
          $set: { parentId: null },
        });
    }
  },

  async down() {
    // Nothing
  },
};
