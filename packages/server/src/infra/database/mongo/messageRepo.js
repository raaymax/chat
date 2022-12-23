const { db } = require('./db');
const { serialize, serializeInsert, deserialize } = require('./serializer');

const TABLE_NAME = 'messages';

const deserializeQuery = (data) => {
  const {
    channelId, before, after, ...query
  } = deserialize(data);
  return {
    channelId,
    ...(!before ? {} : { createdAt: { $lte: new Date(before) } }),
    ...(!after ? {} : { createdAt: { $gte: new Date(after) } }),
    ...query,
  };
};

const message = {
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),

  getAll: async (query, {
    limit = 50,
    offset = 0,
    order = 1,
  } = {}) => (await db)
    .collection(TABLE_NAME)
    .find(deserializeQuery(query))
    .sort({ createdAt: order })
    .skip(offset)
    .limit(limit)
    .toArray()
    .then(serialize),

  insert: async (msg) => (await db).collection(TABLE_NAME).insertOne(deserialize(msg))
    .then(serializeInsert),

  update: async (where, msg) => (await db).collection(TABLE_NAME)
    .updateOne(deserialize(where), { $set: deserialize(msg) }),

  updateThread: async ({ parentId, userId, id }) => (await db).collection(TABLE_NAME)
    .updateOne(deserialize({
      id: parentId,
    }), {
      $push: {
        thread: deserialize({
          userId,
          childId: id,
        }),
      },
      $set: {
        updatedAt: new Date(),
      },
    }),

  remove: async (where) => (await db).collection(TABLE_NAME)
    .deleteOne(deserialize(where)),

  count: async (query) => (await db).collection(TABLE_NAME)
    .count(deserializeQuery(query)),
};

module.exports = message;
