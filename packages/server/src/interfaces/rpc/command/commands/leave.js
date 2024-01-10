
module.exports = {
  name: 'leave',
  description: 'leave current channel',
  args: [],
  handler: async (req, res, {repo, services}) => {
    const { channelId } = req.body.context;
    await services.channel.leave(channelId, req.userId);
    const channel = await repo.channel.get({ id: channelId });
    await res.send({ type: 'channel', ...channel });
    await res.systemMessage([
      { text: 'You left the channel' },
    ]);
    res.ok({ channelId: channel.id });
  },
};
