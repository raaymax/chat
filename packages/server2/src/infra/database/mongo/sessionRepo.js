const { db, ObjectId } = require('./db');

module.exports = {
  get: async (sess) => (await db).collection('sessions')
    .findOne(sess)
    .then((i) => (i ? deserializeSession(i) : null)),
  getAll: async (session) => (await db).collection('sessions')
    .find(session).toArray()
    .then((arr) => arr.map((i) => deserializeSession(i))),
  insert: async (data) => (await db).collection('sessions')
    .insertOne(data)
    .then((i) => ({ ...i, id: i.insertedId.toHexString() })),
  update: async (id, session) => (await db).collection('sessions')
    .updateOne({ _id: ObjectId(id) }, { $set: session }),
  delete: async ({ _id, ...session }) => (await db).collection('sessions')
    .deleteOne(_id ? ({ _id: ObjectId(_id), ...session }) : ({ ...session })),
  getOther: async ({ userId }) => (await db).collection('sessions')
    .find({ userId: { $ne: userId } }).toArray()
    .then((arr) => arr.map((i) => ({ ...i, id: i._id.toHexString() }))),
  getByUsers: async ({ userId }) => (await db).collection('sessions')
    .find({ userId: { $in: [userId].flat() } }).toArray()
    .then((arr) => arr.map((i) => ({ ...i, id: i._id.toHexString() }))),
};

function deserializeSession(session) {
  return {
    ...session,
    id: session._id.toHexString(),
  };
}