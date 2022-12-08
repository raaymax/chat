const db = require('../../infra/database');

module.exports = {
  name: 'leave',
  description: 'leave current channel',
  args: [],
  handler: async (req, res) => {
    const { channel: cid } = req.body.context;
    await db.channel.remove({ cid, userId: req.userId });
    await res.send({ type: 'removeChannel', cid });
    await res.send({
      type: 'message',
      userId: 'system',
      priv: true,
      createdAt: new Date().toISOString(),
      message: [
        { text: 'You left the channel' },
      ],
    });
    res.ok({ cid });
  },
};
