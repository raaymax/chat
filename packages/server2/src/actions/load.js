const { messageRepo, channelRepo } = require('../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const channel = require('../common/channel');

module.exports = async (req, res) => {
  const msg = req.body;

  if (!msg.channel) throw MissingChannel();

  if (!await channel.haveAccess(req.userId, msg.channel)) {
    throw AccessDenied();
  }
  const msgs = await messageRepo.getAll({
    channel: msg.channel,
    before: msg.before,
  }, { limit: msg.limit });

  msgs.forEach((m) => res.send({ type: 'message', ...m }));
  res.ok({ count: msgs.length });
};
