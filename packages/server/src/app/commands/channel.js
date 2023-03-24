const repo = require('../repository');

module.exports = {
  name: 'channel',
  description: 'to create and join new channel',
  args: ['name'],
  handler: async (req, res) => {
    const [cid] = req.body.args;
    const channel = await repo.channel.get({ cid });
    res.send({
      type: 'setChannel',
      channelId: channel.id,
    });
    return res.ok();
  },
};
