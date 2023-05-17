const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);
const config = require('../../../../../config');

module.exports = expressSession({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoDBStore({
    uri: config.databaseUrl,
    collection: 'httpSessions',
  }),
  cookie: {
    secure: config.production,
    sameSite: config.production ? 'None' : 'Lax',
  },
});
