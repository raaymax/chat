const { messageRepo } = require('../infra/database');
const { MissingChannel } = require('../common/errors');

module.exports = async (req, res) => {
  const msg = req.body;

  if(!msg.channel)
    throw MissingChannel();

  const msgs = await messageRepo.getAll({
    channel: msg.channel
  }, {limit: msg.limit});

  msgs.forEach(m => res.send({type: 'message', ...m}));
  res.ok({count: msgs.length});
}
