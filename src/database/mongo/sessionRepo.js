const { db, ObjectId } = require('./db');

module.exports = {
  get: async ({ id, ...session }) => (await db).collection('sessions')
    .findOne({ _id: ObjectId(id), ...session })
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),
  getAll: async (user) => (await db).collection('sessions')
    .find(user).toArray()
    .then((arr) => arr.map((i) => ({ ...i, id: i._id.toHexString() }))),
  insert: async (session) => (await db).collection('sessions')
    .insertOne(session)
    .then((i) => ({ ...i, id: i.insertedId.toHexString() })),
  update: async (id, session) => (await db).collection('sessions')
    .updateOne({ _id: ObjectId(id) }, { $set: session }),
  delete: async ({ _id, ...session }) => (await db).collection('sessions')
    .deleteOne(_id ? ({ _id: ObjectId(_id), ...session }) : ({ ...session })),
  getOther: async ({ userId }) => (await db).collection('sessions')
    .find({ userId: { $ne: userId } }).toArray()
    .then((arr) => arr.map((i) => ({ ...i, id: i._id.toHexString() }))),
};
