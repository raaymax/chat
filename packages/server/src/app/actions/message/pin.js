const Joi = require('joi');
const repo = require('../../../infra/repositories');
const { MissingId, MessageNotExist, AccessDenied } = require('../../common/errors');
const ChannelHelper = require('../../common/channel');

// TODO api changed fix frontend
module.exports = {
  type: 'message:pin',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
      pinned: Joi.boolean().required(),
    }),
  },
  handler: async (req, res) => {
    const { id, pinned } = req.body;
    if (!id) throw MissingId();

    const message = await repo.message.get({ id });
    if (!message) throw MessageNotExist();
    // TODO: test if permissions work in tests
    if (!await ChannelHelper.haveAccess(req.userId, message.channelId)) {
      throw AccessDenied();
    }

    await repo.message.update({ id }, { pinned });
    const channel = await repo.channel.get({ id: message.channelId });
    await res.group(channel.users, {
      id,
      type: 'message',
      ...message,
      pinned,
    });
    return res.ok();
  },
};
