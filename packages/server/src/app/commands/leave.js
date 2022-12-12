const db = require('../../infra/database');

module.exports = {
  name: 'leave',
  description: 'leave current channel',
  args: [],
  handler: async (req, res) => {
    const { channelId } = req.body.context;
    const channel = await db.channel.get({ id: channelId });
    await db.channel.remove({ cid: channel.cid, userId: req.userId });
    await res.send({ type: 'removeChannel', cid: channel.cid });
    await res.send({
      type: 'message',
      userId: 'system',
      priv: true,
      createdAt: new Date().toISOString(),
      channelId: channel.id,
      message: [
        { text: 'You left the channel' },
      ],
    });
    res.ok({ cid: channel.cid });
  },
};
