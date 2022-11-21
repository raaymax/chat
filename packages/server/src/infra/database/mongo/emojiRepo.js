const { db, ObjectId } = require('./db');

module.exports = {
  getAll: async () => (await db).collection('emojis').find({})
    .toArray()
    .then((arr) => arr.map((item) => ({ ...item, id: item._id.toHexString() }))),
  get: async ({ id, ...emoji }) => (await db).collection('emojis')
    .findOne(id ? ({ _id: ObjectId(id), ...emoji }) : ({ ...emoji }))
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),
  insert: async (msg) => (await db).collection('emojis').insertOne(msg)
    .then((item) => ({ ...item, id: item.insertedId.toHexString() })),
};
