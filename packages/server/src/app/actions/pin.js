const Joi = require('joi');
const db = require('../../infra/database');
const { MissingId, MessageNotExist, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

// TODO api changed fix frontend
module.exports = {
  type: 'pin',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
      pinned: Joi.boolean().required(),
    }),
  },
  handler: async (req, res) => {
    const { id, pinned } = req.body;
    if (!id) throw MissingId();

    const message = await db.message.get({ id });
    if (!message) throw MessageNotExist();
    // TODO: test if permissions work in tests
    if (!await ChannelHelper.haveAccess(req.userId, message.channelId)) {
      throw AccessDenied();
    }

    await db.message.update({ id }, { pinned });
    await res.broadcast({
      id,
      type: 'message',
      ...message,
      pinned,
    });
    return res.ok();
  },
};
