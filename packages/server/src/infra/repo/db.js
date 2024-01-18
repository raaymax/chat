const { MongoClient } = require('mongodb');

let db;
let client;
let databaseUrl;

exports.init = (url) => {
  databaseUrl = url;
  client = new MongoClient(databaseUrl);
  return client;
};

exports.connect = async () => {
  if (!databaseUrl) throw new Error('Database not initialized');
  if (db && client) return { db, client };
  client = new MongoClient(databaseUrl);
  await client.connect();
  db = await client.db();
  return { db, client };
};

exports.disconnect = async () => {
  if (client) {
    await client.close();
    db = undefined;
    client = undefined;
  }
};
