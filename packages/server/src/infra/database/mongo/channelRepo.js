const { db, ObjectId } = require('./db');
const { serialize, serializeInsert, deserialize } = require('./serializer');

const TABLE_NAME = 'channels';

const deserializeQuery = (data) => {
  const {
    userId, ...query
  } = deserialize(data);
  return {
    ...(!userId ? {} : { users: { $elemMatch: { $eq: ObjectId(userId) } } }),
    ...query,
  };
};
const deserializeChannel = (data) => {
  const {
    users, ...query
  } = deserialize(data);
  return {
    ...(!users ? {} : { users: users.map((userId) => ObjectId(userId)) }),
    ...query,
  };
};

const serializeChannel = (data) => {
  if (Array.isArray(data)) {
    return data.map(serializeChannel);
  }
  const ret = serialize(data);
  if (!ret) return ret;
  const {
    users = null, ...query
  } = ret;
  return {
    ...query,
    users: users
      ? users.map((user) => (
        user instanceof ObjectId
          ? user.toHexString()
          : user))
      : undefined,
  };
};

module.exports = {
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserializeQuery(query))
    .then(serializeChannel),

  getAll: async (query) => (await db).collection(TABLE_NAME)
    .find(deserializeQuery(query))
    .toArray()
    .then(serializeChannel),

  create: async (channel) => (await db).collection(TABLE_NAME)
    .insertOne(deserializeChannel(channel))
    .then(serializeInsert),

  update: async (id, channel) => (await db).collection(TABLE_NAME)
    .updateOne(deserialize({ id }), { $set: deserializeChannel(channel) }),

  remove: async (channel) => (await db).collection(TABLE_NAME)
    .deleteOne(deserialize(channel)),
};
