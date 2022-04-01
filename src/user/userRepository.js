const { knex } = require('../database/db');

module.exports = {
  getAll: async () => knex('users').select(),
  get: async (user) => knex('users').first().where(user),
  update: async (id, data) => knex('users').update(data).where({ id }).returning('*'),
};
