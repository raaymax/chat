const { ObjectId, MongoClient } = require('mongodb');
const config = require('../../../../../chat.config');

const client = new MongoClient(config.databaseUrl);
async function run() {
  await client.connect();
  return client.db();
}

module.exports = { db: run(), client, ObjectId };
