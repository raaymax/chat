const Joi = require('joi');
const repo = require('../repository');
const { MissingChannel, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

module.exports = {
  type: 'messages:load',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      parentId: Joi.string().optional(),
      pinned: Joi.string().optional(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      aroundIdx: Joi.number().optional(),
      beforeIdx: Joi.number().optional(),
      afterIdx: Joi.number().optional(),
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    const { channelId, parentId } = msg;

    if (!channelId) throw MissingChannel();

    if (!await ChannelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    if (parentId) {
      const parent = await repo.message.get({
        id: parentId,
        channelId,
      });
      res.send({ type: 'message', ...parent });
    }

    const msgs = await repo.message.getAll({
      channelId,
      parentId,
      before: msg.before,
      after: msg.after,
      beforeIdx: msg.beforeIdx,
      afterIdx: msg.afterIdx,
      page: msg.page,
      ...(msg.pinned ? { pinned: msg.pinned } : {}),
    }, { limit: msg.limit, order: msg.after ? 1 : -1 });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({ count: msgs.length });
  },
};
