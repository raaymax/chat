const db = require('../../infra/database');
const services = require('../services');

module.exports = {
  name: 'leave',
  description: 'leave current channel',
  args: [],
  handler: async (req, res) => {
    const { channelId } = req.body.context;
    await services.channel.leave(channelId, req.userId);
    const channel = await db.channel.get({ id: channelId });
    await res.send({ type: 'channel', ...channel });
    await res.systemMessage([
      { text: 'You left the channel' },
    ]);
    res.ok({ channelId: channel.id });
  },
};
