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

module.exports = {
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),

  getAll: async (query, {
    limit = 50,
    offset = 0,
    order = 1,
  }) => (await db)
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

  remove: async (where) => (await db).collection(TABLE_NAME)
    .deleteOne(deserialize(where)),

  count: async (query) => (await db).collection(TABLE_NAME)
    .count(deserializeQuery(query)),
};
