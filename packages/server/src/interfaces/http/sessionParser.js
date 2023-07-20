const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const config = require('@quack/config');

module.exports = expressSession({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: config.databaseUrl,
    collection: 'httpSessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 * 6,
    secure: config.production,
    sameSite: config.production ? 'None' : 'Lax',
  },
});
