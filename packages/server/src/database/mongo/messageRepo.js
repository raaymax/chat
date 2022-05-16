const { db, ObjectId } = require('./db');

module.exports = {
  get: async ({id, ...msg}) => (await db).collection('messages')
    .findOne(id ? ({ _id: ObjectId(id), ...msg }) : ({ ...msg }))
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),

  getAll: async ({
    channel, before, after, offset = 0,
  }) => (await db).collection('messages').find({
    channel,
    ...(!before ? {} : { createdAt: { $lt: new Date(before) } }),
    ...(!after ? {} : { createdAt: { $gt: new Date(after) } }),
  })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(50)
    .toArray()
    .then((arr) => arr.map((item) => ({ ...item, id: item._id.toHexString() }))),

  insert: async (msg) => (await db).collection('messages').insertOne(msg)
    .then((item) => ({ ...item, id: item.insertedId.toHexString() })),

  remove: async ({id, ...msg}) => (await db).collection('messages')
    .deleteOne(id ? ({ _id: ObjectId(id), ...msg }) : ({ ...msg })),
};
