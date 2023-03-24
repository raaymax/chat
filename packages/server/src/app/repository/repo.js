const { db } = require('../../infra/database');
const { InsertResult, ArrayType } = require('./schemas');

const createRepo = (tableName, Query, Model) => ({
  TABLE_NAME: tableName,
  Query,
  Model,

  get: async (arg) => {
    const query = Query.serialize(arg);
    const raw = await (await db)
      .collection(tableName)
      .findOne(query);
    const result = Model.deserialize(raw);
    return result;
  },

  getAll: async (query) => (await db).collection(tableName)
    .find(Query.serialize(query))
    .toArray()
    .then(ArrayType(Model).deserialize),

  create: async (data) => (await db).collection(tableName)
    .insertOne(Model.serialize(data))
    .then(InsertResult.deserialize),

  update: async (query, data, type = 'set') => (await db).collection(tableName)
    .updateOne(Query.serialize(query), { [`$${type}`]: Model.serialize(data) }),

  updateMany: async (query, data, type = 'set') => (await db).collection(tableName)
    .updateMany(Query.serialize(query), { [`$${type}`]: Model.serialize(data) }),

  remove: async (query) => (await db).collection(tableName)
    .deleteOne(Query.serialize(query)),

  count: async (query) => (await db).collection(tableName)
    .count(Query.serialize(query)),
});

module.exports = { createRepo };
