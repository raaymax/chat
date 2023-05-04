/* eslint-disable global-require */
module.exports = (() => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return require('../tests/chat.config.tests');
    }
    // eslint-disable-next-line import/no-unresolved
    return require('../chat.config');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Config file is missing');
    process.exit(1);
  }
})();
