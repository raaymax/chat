/* eslint-disable global-require */
const init = require('./init');

try {
  init();
  if (process.env.NODE_ENV === 'test') {
    module.exports = {
      // eslint-disable-next-line import/no-unresolved
      ...require('../secrets.json'),
      ...require('../tests/chat.config.tests'),
    };
  } else {
    module.exports = {
      // eslint-disable-next-line import/no-unresolved
      ...require('../secrets.json'),
      // eslint-disable-next-line import/no-unresolved
      ...require('../chat.config'),
    };
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Config file is missing');
  process.exit(1);
}
