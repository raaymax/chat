const db = require('../../infra/database');
const { AccessDenied, ChannelNotExist } = require('../common/errors');
const channelHelper = require('../common/channel');

module.exports = {
  name: 'join',
  description: 'join current channel',
  args: [],
  handler: async (req, res) => {
    const { channelId } = req.body.context;

    const channel = await db.channel.get({ id: channelId });
    if (!await channelHelper.haveAccess(req.userId, channel.id)) {
      throw AccessDenied();
    }
    if (!channel) throw ChannelNotExist();
    const id = await db.channel.insert({
      cid: channel.cid,
      name: channel.name,
      userId: req.userId,
    });
    const createdChannel = await db.channel.get({ id });
    res.send({
      type: 'channel',
      cid: createdChannel.cid,
      name: createdChannel.name,
      users: createdChannel.users,
    });
    return res.ok({ id });
  },
};
