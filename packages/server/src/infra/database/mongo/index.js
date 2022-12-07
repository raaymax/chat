/* eslint-disable global-require */
const { db, client, ObjectId } = require('./db');

module.exports = {
  db,
  ObjectId,
  user: require('./userRepo'),
  session: require('./sessionRepo'),
  message: require('./messageRepo'),
  channel: require('./channelRepo'),
  badge: require('./badgesRepo'),
  emoji: require('./emojiRepo'),
  close: () => client.close(),
};
