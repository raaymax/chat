const { messageRepo } = require('../infra/database');
const { MissingChannel, MissingMessage } = require('../common/errors');
const push = require('../infra/push');

module.exports = async (req, res) => {
  const msg = req.body;

  if(!msg.message) throw MissingMessage();
  if(!msg.channel) throw MissingChannel();

  const id = await messageRepo.insert({
    message: msg.message,
    channel: msg.channel,
    clientId: msg.clientId,
    userId: msg.userId,
    createdAt: new Date(),
  });
  const created = await messageRepo.get({id});

  res.broadcast({type: 'message', ...created});
  push.send(created);
  res.ok();
}
