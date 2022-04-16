const { knex } = require('./db');

module.exports = {
  getAll: async ({
    channel, before, after, offset = 0,
  }) => knex('messages')
    .select('messages.*')
    .select(knex.raw('to_jsonb(??.*) as ??', ['user', 'user']))
    .leftJoin('users as user', 'messages.userId', 'user.id')
    .where((qb) => {
      qb.where({ channel });
      if (before) qb.andWhere('messages.createdAt', '<', before);
      if (after) qb.andWhere('messages.createdAt', '>', after);
    })
    .orderBy('messages.createdAt', 'desc')
    .limit(50)
    .offset(offset),
  insert: async (msg) => knex('messages').insert({ ...msg, message: JSON.stringify(msg.message) }).returning('*').then((a) => a[0]),
};
