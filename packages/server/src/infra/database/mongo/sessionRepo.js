const { db, ObjectId } = require('./db');

module.exports = {
  get: async (sess) => (await db).collection('httpSessions')
    .findOne(sess)
    .then((i) => (i ? deserializeSession(i) : null)),
  getByToken: async (token) => (await db).collection('httpSessions')
    .findOne({"session.token": token})
    .then((i) => (i ? deserializeSession(i) : null)),
  getAll: async (session) => (await db).collection('httpSessions')
    .find(session).toArray()
    .then((arr) => arr.map((i) => deserializeSession(i))),
  insert: async (data) => (await db).collection('httpSessions')
    .insertOne(data)
    .then((i) => ({ ...i, id: i.insertedId.toHexString() })),
  update: async (id, session) => (await db).collection('httpSessions')
    .updateOne({ _id: ObjectId(id) }, { $set: session }),
  delete: async ({ _id, ...session }) => (await db).collection('httpSessions')
    .deleteOne(_id ? ({ _id: ObjectId(_id), ...session }) : ({ ...session })),
  getOther: async ({ userId }) => (await db).collection('httpSessions')
    .find({ 'session.userId': { $ne: userId } }).toArray()
    .then((arr) => arr.map((i) => ({ ...i, id: i._id.toHexString() }))),
  getByUsers: async ({ userId }) => (await db).collection('httpSessions')
    .find({ 'session.userId': { $in: [userId].flat() } }).toArray()
    .then((arr) => arr.map((i) => i.session)),
};

function deserializeSession(session) {
  return {
    ...session,
    id: session._id,
  };
}
