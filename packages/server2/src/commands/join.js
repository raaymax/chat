const { channelRepo } = require('../infra/database');
const { AccessDenied } = require('../common/errors');
const channelHelper = require('../common/channel');

module.exports = {
  name: 'join',
  description: 'join current channel',
  args: [],
  handler: async (req, res) => {
    const { channel } = req.body.context;

    if (!await channelHelper.haveAccess(req.userId, channel)) {
      throw AccessDenied();
    }

    const id = await channelRepo.insert({
      cid: channel,
      name: channel,
      userId: req.userId,
    });
    const createdChannel = await channelRepo.get({ id });
    res.send({
      type: 'channel',
      cid: createdChannel.cid,
      name: createdChannel.name,
      users: createdChannel.users,
    });
    return res.ok({ id });
  },
};
