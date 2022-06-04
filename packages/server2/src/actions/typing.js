const { MissingChannel, MissingMessage } = require('../common/errors');
module.exports = (req, res) => {
  const {channel} = req.body;

  if(!channel) throw MissingChannel();

  res.broadcast({
    type: 'typing',
    userId: req.userId,
    channel,
  })
  res.ok();
}
