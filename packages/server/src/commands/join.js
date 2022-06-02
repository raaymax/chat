const { channelRepo } = require('../database/db');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const cid = self.channel;
    const id = await channelRepo.insert({
      cid,
      name: cid,
      userId: self.user.id,
    });
    const channel = await channelRepo.get({ id });
    self.send({ type: 'addChannel', channel }, msg.seqId);
    msg.ok({ id });
}
