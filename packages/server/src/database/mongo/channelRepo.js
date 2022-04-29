const { db, ObjectId } = require('./db');

module.exports = {
  get: async ({ id, ...channel }) => (await db).collection('channels')
    .findOne(id ? ({ _id: ObjectId(id), ...channel }) : ({ ...channel }))
    .then((i) => (i ? ({ ...i, id: i._id.toHexString() }) : null)),

  getAll: async ({ userId }) => (await db).collection('channels').find({
    users: { $elemMatch: { $eq: ObjectId(userId) } },
  })
    .toArray()
    .then((arr) => arr.map((item) => ({ ...item, id: item._id.toHexString() }))),

  insert: async ({ name, userId }) => {
    const channel = await (await db).collection('channels').findOne({ name });
    if (channel && channel.users.includes(ObjectId(userId))) {
      return channel._id.toHexString();
    }
    if (channel) {
      channel.users.push(ObjectId(userId));
      await (await db).collection('channels').updateOne({ _id: channel._id }, { $set: { users: channel.users } });
      return channel._id.toHexString();
    }

    return (await db).collection('channels').insertOne({ name, users: [ObjectId(userId)] })
      .then((item) => ({ ...item, id: item.insertedId.toHexString() }));
  },

  remove: async ({ name, userId }) => {
    const channel = await (await db).collection('channels').findOne({ name });
    if (channel && channel.users.includes(ObjectId(userId))) {
      const idx = channel.users.indexOf(ObjectId(userId));
      await (await db).collection('channels').updateOne({ _id: channel._id }, { $set: { users: channel.users.splice(idx, 1) } });
      return channel._id.toHexString();
    }
    return null;
  },
};
