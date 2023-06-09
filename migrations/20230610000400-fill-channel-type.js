/* eslint-disable no-restricted-syntax */

const getChannelType = (channel) => {
  if (channel.direct) return 'DIRECT';
  if (channel.private) return 'PRIVATE';
  return 'PUBLIC';
};

module.exports = {
  async up(db) {
    const cursor = await db.collection('channels').find({});
    while (await cursor.hasNext()) {
      const channel = await cursor.next();
      await db.collection('channels')
        .updateOne({ _id: channel._id }, {
          $set: { channelType: getChannelType(channel) },
        });
    }
  },

  async down() {
    // Nothing
  },
};
