const { db } = require('./db');
const { serialize, serializeInsert, deserialize } = require('./serializer');

const TABLE_NAME = 'files';

module.exports = {
  getAll: async (query) => (await db).collection(TABLE_NAME)
    .find(deserialize(query))
    .toArray()
    .then(serialize),
  get: async (query) => (await db).collection(TABLE_NAME)
    .findOne(deserialize(query))
    .then(serialize),
  insert: async (msg) => (await db).collection(TABLE_NAME)
    .insertOne(deserialize(msg))
    .then(serializeInsert),
};
