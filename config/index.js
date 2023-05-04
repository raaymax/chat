module.exports = (() => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return require('../tests/chat.config.tests.js');
    }
    return require('../chat.config.js');
  } catch (err) {
    console.error('Config file is missing');
    process.exit(1);
  }
})();
