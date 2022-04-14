const { ObjectId, MongoClient } = require('mongodb');

const URI = 'mongodb://chat:chat@localhost:27017/chat?authSource=admin';

const client = new MongoClient(process.env.DATABASE_URL || URI);
async function run() {
  await client.connect();
  return client.db();
}

module.exports = { db: run(), ObjectId };
