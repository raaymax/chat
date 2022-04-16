/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const Knex = require('knex');
const { MongoClient } = require('mongodb');
const { types } = require('pg');

types.setTypeParser(1082, (val) => val);

// const URL = 'postgres://chat:chat@chat_db:5432/chat'
// const URL = 'postgres://chat:chat@localhost:5432/chat'
module.exports = async function migrate(_self, msg) {
  const url = msg.command.args[0];
  const client = new MongoClient(process.env.DATABASE_URL);
  await client.connect();
  const knex = Knex({
    client: 'pg',
    connection: url,
  });
  const users = await client.db().collection('users').find({}).toArray();
  const userMap = users.reduce((acc, user) => ({
    ...acc,
    [user.clientId]: user._id.toHexString(),
  }), {});
  const messages = await knex('messages').select();

  for (const m of messages) {
    delete m.id;
    await client.db().collection('messages').insertOne({
      ...m, userId: userMap[m.userId],
    });
  }
  msg.ok();
};
