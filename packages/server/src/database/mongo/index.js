/* eslint-disable global-require */
const { client } = require('./db');

module.exports = {
  userRepo: require('./userRepo'),
  sessionRepo: require('./sessionRepo'),
  messageRepo: require('./messageRepo'),
  channelRepo: require('./channelRepo'),
  close: () => client.close(),
};
