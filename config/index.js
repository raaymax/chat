/* eslint-disable global-require */
try {
  if (process.env.NODE_ENV === 'test') {
    module.exports = require('../tests/chat.config.tests');
  } else {
  // eslint-disable-next-line import/no-unresolved
    module.exports = require('../chat.config');
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Config file is missing');
  process.exit(1);
}
