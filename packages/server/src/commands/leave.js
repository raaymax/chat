const { channelRepo } = require('../database/db');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
  if (!self.user) return msg.error(Errors.AccessDenied());
  const cid = self.channel;
  await channelRepo.remove({ cid, userId: self.user.id });
  self.send({ type: 'rmChannel', cid }, msg.seqId);
  await self.send(msgFactory.createSystemMessage({
    seqId: msg.seqId,
    message: [
      { text: 'You left the channel' },
    ],
  }));
  msg.ok({ cid });
};
