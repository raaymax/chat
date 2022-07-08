/* eslint-disable global-require */

module.exports = [
  require('./message'),
  require('./load'),
  require('./setupFcm'),
  require('./channels'),
  require('./typing'),
  require('./greet'),
  require('./removeMessage'),
  require('./command'),
  require('./config'),
  require('./users'),
  {
    type: 'default',
    handler: (req) => {
      const err = new Error('Unknown action');
      err.action = req.type;
      throw err;
    },
  },
].map((module) => ({
  [module.type]: module,
})).reduce((acc, item) => ({ ...acc, ...item }), {});
