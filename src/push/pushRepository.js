const {knex} = require('../database/db');

module.exports = {
  getOther: async ({userId}) => knex('push').select().where('userId', '!=', userId),
  upsert: async (msg) => knex('push').insert(msg)
    .onConflict(['userId', 'sessionId'])
    .merge()
    .returning('*'),
}
