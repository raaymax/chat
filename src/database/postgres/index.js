/* eslint-disable global-require */
const { knex } = require('./db');

module.exports = {
  userRepo: require('./userRepo'),
  sessionRepo: require('./sessionRepo'),
  messageRepo: require('./messageRepo'),
  init: require('./init'),
  close: () => knex.destroy(),
};
