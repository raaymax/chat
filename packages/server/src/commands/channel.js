const { channelRepo } = require('../database/db');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => { 
    if (!self.user) return msg.error(Errors.AccessDenied());
    const [cid] = msg.args;
    const channel = await channelRepo.get({ cid });
    // FIXME remove toHexString()
    if (channel?.private && !channel.users.map((u) => u.toHexString()).includes(self.user.id)) {
      return msg.error(Errors.AccessDenied());
    }
    self.channel = cid;
    await self.send({
      type: 'setChannel',
      channel: self.channel,
    }, msg.seqId);
    msg.ok();
};
