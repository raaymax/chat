const { ObjectId } = require('mongodb');
const config = require('@quack/config');
const { connect, init, disconnect } = require('./db');
const { SessionRepo } = require('./session');

module.exports = () => {
  init(config.databaseUrl);
  return {
    connect,
    ObjectId,
    session: new SessionRepo(),
    close: () => disconnect(),
  };
};
