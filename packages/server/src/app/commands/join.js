const repo = require('../../infra/repositories');
const { AccessDenied, ChannelNotExist } = require('../common/errors');
const channelHelper = require('../common/channel');
const services = require('../services');

module.exports = {
  name: 'join',
  description: 'join current channel',
  args: [],
  handler: async (req, res) => {
    const { channelId } = req.body.context;

    const channel = await repo.channel.get({ id: channelId });
    if (!await channelHelper.haveAccess(req.userId, channel.id)) {
      throw AccessDenied();
    }
    if (!channel) throw ChannelNotExist();
    const id = await services.channel.join(channel.id, req.userId);

    const joinedChannel = await repo.channel.get({ id });
    res.send({
      type: 'channel',
      ...joinedChannel,
    });
    return res.ok({ id });
  },
};
