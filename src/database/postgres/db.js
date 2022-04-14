const Knex = require('knex');
const { types } = require('pg');

let client = null;
module.exports = {
  get knex() {
    if (!client) {
      types.setTypeParser(1082, (val) => val);
      client = Knex({
        client: 'pg',
        connection: process.env.DATABASE_URL || 'postgres://chat:chat@localhost:5432/chat',
      });
    }
    return client;
  },
};
