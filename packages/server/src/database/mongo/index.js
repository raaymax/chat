/* eslint-disable global-require */
const { client, ObjectId } = require('./db');

module.exports = {
  ObjectId,
  userRepo: require('./userRepo'),
  sessionRepo: require('./sessionRepo'),
  messageRepo: require('./messageRepo'),
  channelRepo: require('./channelRepo'),
  close: () => client.close(),
};
