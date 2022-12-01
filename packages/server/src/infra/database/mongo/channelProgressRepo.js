const { db, ObjectId } = require('./db');

const TABLE_NAME = 'channelProgress';
const {serialize} = require('./serializer');

const deserialize = (query) => Object.fromEntries(Object.entries({
  ...query,
  _id: query.id ? ObjectId(query.id) : undefined,
  id: undefined,
  userId: query.userId ? ObjectId(query.userId) : undefined,
  channelId: query.channelId ? ObjectId(query.channelId) : undefined,
  lastMessageId: query.lastMessageId ? ObjectId(query.lastMessageId) : undefined,
}).filter(([, value]) => value !== undefined));

module.exports = {
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),

  getAll: async (query) => console.log(deserialize(query)) || (await db).collection(TABLE_NAME).find(deserialize(query))
    .toArray()
    .then((arr) => arr.map(serialize)),

  insert: async ({ cid, name, userId }) => {
    const channel = await (await db).collection(TABLE_NAME).findOne({ cid });
    if (channel && channel.users.map((u) => u.toHexString()).includes(userId)) {
      return channel._id.toHexString();
    }
    if (channel) {
      channel.users.push(ObjectId(userId));
      await (await db).collection(TABLE_NAME).updateOne(
        { _id: channel._id },
        { $set: { users: channel.users } },
      );
      return channel._id.toHexString();
    }

    return (await db).collection(TABLE_NAME).insertOne({ cid, name, users: [ObjectId(userId)] })
      .then((item) => ({ ...item, id: item.insertedId.toHexString() }));
  },

  update: async ({ id, ...where }, msg) => (await db).collection(TABLE_NAME)
    .updateOne(id ? ({ _id: ObjectId(id), ...where }) : where, { $set: msg }),

  upsert: async ({
    channelId, userId, lastRead, ...data
  }) => {
    const database = await db;

    const progress = await database.collection(TABLE_NAME)
      .findOne(deserialize({ channelId, userId }));

    if (progress && progress.lastRead > lastRead) return;

    if (!progress) {
      await database.collection(TABLE_NAME)
        .insertOne(deserialize({ channelId, userId, lastRead, ...data }))
        .then(serialize);
    } else {
      await database.collection(TABLE_NAME)
        .updateOne({ _id: progress._id }, { $set: deserialize({ lastRead, ...data }) });
    }
  },

  remove: async ({ cid, userId }) => {
    const channel = await (await db).collection(TABLE_NAME).findOne({ cid });
    if (channel && channel.users.map((u) => u.toHexString()).includes(userId)) {
      const users = channel.users.filter((u) => u.toHexString() !== userId);
      await (await db).collection(TABLE_NAME).updateOne({ _id: channel._id }, { $set: { users } });
      return channel._id.toHexString();
    }
    return null;
  },
};
