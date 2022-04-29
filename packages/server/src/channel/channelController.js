const { channelRepo } = require('../database/db');
const Errors = require('../errors');

module.exports = {
  getAll: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const channels = await channelRepo.getAll({ userId: self.user.id });
    channels.forEach((channel) => {
      self.send({ seqId: msg.seqId, channel: { id: channel.id, name: channel.name } });
    });
    msg.ok();
  },

  changeChannel: async (self, msg) => {
    const [channel] = msg.command.args;
    self.channel = channel;
    await self.op({
      type: 'setChannel',
      channel: self.channel,
    }, msg.seqId);
    msg.ok();
  },

  create: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const id = await channelRepo.insert({ name: msg.op.name, userId: self.user.id });
    const channel = await channelRepo.get({ id });
    self.send({ seqId: msg.seqId, channel: { id, name: channel.name } });
    msg.ok({ id });
  },

  remove: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const id = await channelRepo.insert({ name: msg.op.name, userId: self.user.id });
    msg.ok({ id });
  },

};
