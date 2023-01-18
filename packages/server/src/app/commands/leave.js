const db = require('../../infra/database');

module.exports = {
  name: 'leave',
  description: 'leave current channel',
  args: [],
  handler: async (req, res) => {
    const { channelId } = req.body.context;
    const channel = await db.channel.get({ id: channelId });
    await db.channel.remove({ id: channel.id, userId: req.userId }); // FIXME
    await res.send({ type: 'removeChannel', channelId: channel.id });
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
    res.ok({ channelId: channel.id });
  },
};
