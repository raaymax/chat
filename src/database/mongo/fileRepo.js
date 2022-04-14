const { db, ObjectId } = require('./db');

module.exports = {
  getAll: async () => (await db).collection('files').find({})
    .toArray()
    .then((arr) => arr.map((item) => ({ ...item, id: item._id.toHexString() }))),
  get: async ({ id, ...file }) => (await db).collection('files')
    .findOne(id ? ({ _id: ObjectId(id), ...file }) : ({ ...file }))
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),
  insert: async (msg) => (await db).collection('files').insertOne(msg)
    .then((item) => ({ ...item, id: item.insertedId.toHexString() })),
};
