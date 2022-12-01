/* eslint-disable global-require */
const { db, client, ObjectId } = require('./db');

module.exports = {
  db,
  ObjectId,
  userRepo: require('./userRepo'),
  sessionRepo: require('./sessionRepo'),
  messageRepo: require('./messageRepo'),
  channelRepo: require('./channelRepo'),
  channelProgressRepo: require('./channelProgressRepo'),
  emojiRepo: require('./emojiRepo'),
  close: () => client.close(),
};
