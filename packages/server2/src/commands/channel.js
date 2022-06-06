const { channelRepo } = require('../infra/database');


//FIXME remove this and validate channel in other actions
module.exports = {
  name: 'channel',
  description: 'change current channel',
  args: ['name'],
  handler: async (req, res) => {
    const [cid] = res.body.args;
    const channel = await channelRepo.get({ cid });
    // FIXME remove toHexString()
    if (channel?.private 
      && !channel.users.map((u) => u.toHexString()).includes(self.user.id)) {
      throw new Error('ACCESS_DENIED');
    }
    await res.send({
      type: 'setChannel',
      channel: self.channel,
    });
    return res.ok();
  }
}
