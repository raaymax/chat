const { knex } = require('../database/db');

const prefixKeys = (prefix) => (obj) => Object.entries(obj).reduce((acc, e) => ({ ...acc, [`${prefix}.${e[0]}`]: e[1] }), {});
const fromSessions = prefixKeys('sessions');

module.exports = {
  get: (session) => knex('sessions')
    .first('sessions.*', knex.raw('to_jsonb(??.*) as ??', ['user', 'user']))
    .leftJoin('users as user', 'sessions.userId', 'user.id')
    .where(fromSessions(session)),
  getAll: async () => knex('sessions')
    .select('sessions.*')
    .select(knex.raw('to_jsonb(??.*) as ??', ['user', 'user']))
    .leftJoin('users as user', 'sessions.userId', 'user.id'),
  getOther: async ({ userId }) => knex('sessions').select().where('userId', '!=', userId),
  insert: async (session) => knex('sessions').insert(session).returning('*'),
  update: async (id, session) => knex('sessions').update(session).where({ id }).returning('*'),
  delete: async (session) => knex('sessions').delete().where(session),
};
