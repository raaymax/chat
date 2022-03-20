const {knex} = require('../database/db');

module.exports = {
  getAll: async (channel) => knex('messages')
    .select('messages.*')
    .select(knex.raw('to_jsonb(??.*) as ??', ['user', 'user']))
    .leftJoin('users as user', 'messages.userId', 'user.id')
    .where({channel})
    .orderBy('messages.createdAt')
    .limit(100),
  insert: async (msg) => knex('messages').insert(msg).returning('*'),
}


