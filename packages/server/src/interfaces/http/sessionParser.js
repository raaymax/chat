const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const config = require('../../../../../chat.config');

module.exports = expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: config.databaseUrl,
    collection: 'httpSessions',
  }),
  cookie: {
    secure: !config.development,
    httpOnly: true,
    sameSite: !config.development ? 'None' : 'Lax',
  },
});
