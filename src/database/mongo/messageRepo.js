const { db } = require('./db');

module.exports = {
  getAll: async ({
    channel, before, after, offset = 0,
  }) => (await db).collection('messages').find({
    channel,
    ...(!before ? {} : { createdAt: { $lt: before } }),
    ...(!after ? {} : { createdAt: { $gt: after } }),
  }, { sort: { createdAt: 1 } })
    .skip(offset)
    .limit(50)
    .toArray()
    .then((arr) => arr.map((item) => ({ ...item, id: item._id.toHexString() }))),

  insert: async (msg) => (await db).collection('messages').insertOne(msg)
    .then((item) => ({ ...item, id: item.insertedId.toHexString() })),
};
