const { db } = require('./db');

const TABLE_NAME = 'badges';
const { serialize, deserialize } = require('./serializer');

module.exports = {
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),

  getAll: async (query) => (await db).collection(TABLE_NAME).find(deserialize(query))
    .toArray()
    .then((arr) => arr.map(serialize)),

  upsert: async ({
    channelId, parentId, userId, lastRead, ...data
  }) => {
    const database = await db;

    console.log(deserialize({ channelId, parentId, userId }));
    const progress = await database.collection(TABLE_NAME)
      .findOne(deserialize({ channelId, parentId, userId }));

    if (progress && progress.lastRead > lastRead) return;

    if (!progress) {
      await database.collection(TABLE_NAME)
        .insertOne(deserialize({
          count: 0,
          channelId,
          parentId,
          userId,
          lastRead,
          ...data,
        }))
        .then(serialize);
    } else {
      await database.collection(TABLE_NAME)
        .updateOne({ _id: progress._id }, { $set: deserialize({ lastRead, ...data }) });
    }
  },

  increment: async (where) => (await db).collection(TABLE_NAME)
    .updateMany(deserialize(where), { $inc: { count: 1 } }),

  reset: async (where) => (await db).collection(TABLE_NAME)
    .updateMany(deserialize(where), { $set: { count: 0 } }),
};
