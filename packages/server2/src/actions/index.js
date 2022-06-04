module.exports = {
  ping: require('./ping'),
  message: require('./message'),
  load: require('./load'),
  setupFcm: require('./setupFcm'),
  channels: require('./channels'),
  typing: require('./typing'),
  greet: require('./greet'),
  removeMessage: require('./removeMessage'),
  default: (req, res) => {
    throw new Error('Unknown action');
  },
}
