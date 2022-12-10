const { db } = require('./db');
const { serialize, deserialize } = require('./serializer');

const TABLE_NAME = 'users';

module.exports = {
  getAll: async (query) => (await db).collection(TABLE_NAME)
    .find(deserialize(query))
    .toArray()
    .then(serialize),
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),
  update: async (id, user) => (await db).collection(TABLE_NAME)
    .updateOne(deserialize({ id }), { $set: deserialize(user) }),
  removeProp: async (id, user, type = 'set') => (await db).collection(TABLE_NAME)
    .updateOne(deserialize({ id }), { [`$${type}`]: deserialize(user) }),
};
