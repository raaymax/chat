const { db, ObjectId } = require('./db');
const { serialize, serializeInsert, deserialize } = require('./serializer');

const TABLE_NAME = 'channels';

module.exports = {
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),

  getAll: async ({ userId }) => (await db).collection(TABLE_NAME).find({
    users: { $elemMatch: { $eq: ObjectId(userId) } },
  })
    .toArray()
    .then(serialize),

  create: async (channel) => (await db).collection(TABLE_NAME)
    .insertOne(deserialize(channel))
    .then(serializeInsert),

  update: async (id, channel) => (await db).collection(TABLE_NAME)
    .updateOne(deserialize({ id }), { $set: deserialize(channel) }),

  insert: async ({ cid, name, userId }) => {
    const channel = await (await db).collection(TABLE_NAME).findOne({ cid });
    if (channel && channel.users.map((u) => u.toHexString()).includes(userId)) {
      return channel._id.toHexString();
    }
    if (channel) {
      channel.users.push(ObjectId(userId));
      await (await db).collection(TABLE_NAME)
        .updateOne({ _id: channel._id }, { $set: { users: channel.users } });
      return channel._id.toHexString();
    }

    return (await db).collection(TABLE_NAME).insertOne({ cid, name, users: [ObjectId(userId)] })
      .then(serializeInsert);
  },

  remove: async ({ id, userId }) => {
    const channel = await (await db).collection(TABLE_NAME).findOne({ _id: ObjectId(id) });
    if (channel && channel.users.map((u) => u.toHexString()).includes(userId)) {
      const users = channel.users.filter((u) => u.toHexString() !== userId);
      await (await db).collection(TABLE_NAME).updateOne({ _id: channel._id }, { $set: { users } });
      return channel._id.toHexString();
    }
    return null;
  },
};
