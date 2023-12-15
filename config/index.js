/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const path = require('path');
const init = require('./init');

const defaults = {
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL,
  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: 'uniquelocal',
  cors: [
    'https?://localhost(:[0-9]{,4})',
  ],
  storage: {
    type: 'fs',
    directory: path.resolve(__dirname, '../uploads'),
  },
  baseUrl: 'http://localhost:8080',
};

try {
  init();
  if (process.env.NODE_ENV === 'test') {
    module.exports = {
      ...defaults,
      // eslint-disable-next-line import/no-unresolved
      ...safeLoad('../secrets.json'),
      ...safeLoad('../tests/chat.config.tests'),
    };
  } else {
    module.exports = {
      ...defaults,
      // eslint-disable-next-line import/no-unresolved
      ...safeLoad('../secrets.json'),
      // eslint-disable-next-line import/no-unresolved
      ...safeLoad('../chat.config'),
    };
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Config file is missing');
  process.exit(1);
}

function safeLoad(file) {
  try {
    return require(file);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return {};
  }
}
