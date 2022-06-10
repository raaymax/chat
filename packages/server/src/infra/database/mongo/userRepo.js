const { db, ObjectId } = require('./db');

module.exports = {
  getAll: async () => {
    const cursor = (await db).collection('users').find();
    return cursor.toArray()
      .then((arr) => arr.map((i) => ({ ...i, id: i._id.toHexString() })));
  },
  get: async ({ id, ...user }) => (await db).collection('users')
    .findOne(id ? ({ _id: ObjectId(id), ...user }) : ({ ...user }))
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),
  update: async (id, user) => (await db).collection('users')
    .updateOne({ _id: ObjectId(id) }, { $set: user }),
};
