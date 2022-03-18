const {knex} = require('../database/db');

module.exports = {
  get: async (session) => knex('sessions')
    .first('sessions.*', knex.raw('to_jsonb(??.*) as ??', ['user', 'user']))
    .leftJoin('users as user', 'sessions.userId', 'user.id')
    .where(session),
  getAll: async () => knex('sessions')
    .select('sessions.*')
    .select(knex.raw('to_jsonb(??.*) as ??', ['user', 'user']))
    .leftJoin('users as user', 'sessions.userId', 'user.id'),
  insert: async (session) => knex('sessions').insert(session).returning('*'),
  update: async (series, session) => knex('sessions').update(session).where({series}).returning('*'),
  delete: async (session) => knex('sessions').delete().where(session),
}

