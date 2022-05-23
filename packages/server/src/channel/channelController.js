const { channelRepo } = require('../database/db');
const Errors = require('../errors');

module.exports = {
  getAll: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const channels = await channelRepo.getAll({ userId: self.user.id });
    channels.forEach((channel) => {
      self.op({ type: 'addChannel', channel }, msg.seqId);
    });
    msg.ok();
  },

  changeChannel: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const [cid] = msg.args;
    const channel = await channelRepo.get({ cid });
    // FIXME remove toHexString()
    if (channel?.private && !channel.users.map((u) => u.toHexString()).includes(self.user.id)) {
      return msg.error(Errors.AccessDenied());
    }
    self.channel = cid;
    await self.op({
      type: 'setChannel',
      channel: self.channel,
    }, msg.seqId);
    msg.ok();
  },

  join: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const cid = self.channel;
    const id = await channelRepo.insert({
      cid,
      name: cid,
      userId: self.user.id,
    });
    const channel = await channelRepo.get({ id });
    self.op({ type: 'addChannel', channel }, msg.seqId);
    msg.ok({ id });
  },

  leave: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const cid = self.channel;
    await channelRepo.remove({ cid, userId: self.user.id });
    self.op({ type: 'rmChannel', cid }, msg.seqId);
    await self.sys([
      { text: 'You left the channel' },
    ], { priv: true, seqId: msg.seqId });
    msg.ok({ cid });
  },
};
