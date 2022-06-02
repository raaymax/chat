const config = require('../../../../../chat.config');
const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);

module.exports = expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: config.databaseUrl,
    collection: 'httpSessions'
  }),
  cookie: {
    secure: 'auto',
  },
});
