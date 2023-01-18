const db = require('../../infra/database');

module.exports = {
  name: 'channel',
  description: 'to change channel',
  args: ['name'],
  handler: async (req, res) => {
    const [cid] = req.body.args;
    const channel = await db.channel.get({ cid });
    res.send({
      type: 'setChannel',
      channelId: channel.id,
    });
    return res.ok();
  },
};
