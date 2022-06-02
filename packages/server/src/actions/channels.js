const { channelRepo } = require('../database/db');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');
  
module.exports = (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const channels = await channelRepo.getAll({ userId: self.user.id });
    channels.forEach((channel) => {
      self.send({ type: 'addChannel', channel }, msg.seqId);
    });
    msg.ok();
}
