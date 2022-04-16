/* eslint-disable global-require */
const { client } = require('./db');

module.exports = {
  userRepo: require('./userRepo'),
  sessionRepo: require('./sessionRepo'),
  messageRepo: require('./messageRepo'),
  init: require('./init'),
  close: () => client.close(),
};
