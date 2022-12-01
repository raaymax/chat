const Joi = require('joi');
const { messageRepo, channelProgressRepo, channelRepo } = require('../infra/database');
const { MissingChannel, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

module.exports = {
  type: 'loadProgress',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    if (!msg.channelId) throw MissingChannel();
    const channel = await channelRepo.get({ id: msg.channelId });

    if (!await ChannelHelper.haveAccess(req.userId, channel.cid)) {
      throw AccessDenied();
    }
    const progresses = await channelProgressRepo.getAll({ channelId: channel.id });
    console.log(progresses);
    progresses.forEach((progress) => res.send({ type: 'progress', ...progress }));
    res.ok({ count: progresses.length });
  },
};
