/* eslint-disable global-require */

module.exports = [
  require('./ping'),
  require('./message'),
  require('./setupFcm'),
  require('./loadChannels'),
  require('./findChannel'),
  require('./typing'),
  require('./greet'),
  require('./removeMessage'),
  require('./updateMessage'),
  require('./reaction'),
  require('./command'),
  require('./config'),
  require('./users'),
  require('./search'),
  require('./pins'),
  require('./pin'),
  require('./findEmoji'),
  require('./loadMessages'),
  require('./loadEmojis'),
  require('./loadProgress'),
  require('./loadBadges'),
  require('./updateProgress'),
  require('./createChannel'),
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
