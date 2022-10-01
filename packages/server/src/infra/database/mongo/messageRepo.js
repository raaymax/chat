const { db, ObjectId } = require('./db');

module.exports = {
  get: async ({ id, ...msg }) => (await db).collection('messages')
    .findOne(id ? ({ _id: ObjectId(id), ...msg }) : ({ ...msg }))
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),

  getAll: async ({
    channel, before, after, ...query
  }, {
    limit = 50,
    offset = 0,
  }) => (await db)
    .collection('messages')
    .find({
      channel,
      ...(!before ? {} : { createdAt: { $lte: new Date(before) } }),
      ...(!after ? {} : { createdAt: { $gte: new Date(after) } }),
      ...query,
    })
    .sort({ createdAt: after ? 1 : -1 })
    .skip(offset)
    .limit(limit)
    .toArray()
    .then((arr) => arr.map((item) => ({
      ...item,
      id: item._id.toHexString(),
      _id: undefined,
    }))),

  insert: async (msg) => (await db).collection('messages').insertOne(msg)
    .then((item) => ({ ...item, id: item.insertedId.toHexString() })),

  update: async ({ id, ...where }, msg) => (await db).collection('messages')
    .updateOne(id ? ({ _id: ObjectId(id), ...where }) : where, { $set: msg }),

  remove: async ({ id, ...msg }) => (await db).collection('messages')
    .deleteOne(id ? ({ _id: ObjectId(id), ...msg }) : ({ ...msg })),
};
