module.exports = {
  ping: require('./ping'),
  message: require('./message'),
  load: require('./load'),
  setupFcm: require('./setupFcm'),
  channels: require('./channels'),
  typing: require('./typing'),
  greet: require('./greet'),
  removeMessage: require('./removeMessage'),
  command: require('./command'),
  config: require('./config'),
  users: require('./users'),
  default: (req, res) => {
    const err = new Error('Unknown action');
    err.action = req.type;
    throw err;
  },
};
