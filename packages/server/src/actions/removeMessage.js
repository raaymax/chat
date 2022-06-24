const { messageRepo } = require('../infra/database');
// const service = require('../message/messageService');
// const Errors = require('../errors');
const { MissingId, NotOwnerOfMessage, MessageNotExist } = require('../common/errors');

module.exports = async (req, res) => {
  const { id } = req.body;
  if (!id) throw MissingId();

  const message = await messageRepo.get({ id });
  if (!message) throw MessageNotExist();

  if (req.userId !== message.userId) throw NotOwnerOfMessage();

  await messageRepo.remove({ id });
  await res.broadcast({
    id,
    type: 'message',
    channel: message.channel,
    message: [],
    user: {
      name: 'System',
    },
    notifType: 'warning',
    notif: 'Message removed',
  });
  return res.ok();
};
