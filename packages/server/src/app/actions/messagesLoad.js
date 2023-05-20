const Joi = require('joi');
const repo = require('../../infra/repositories');
const { MissingChannel, AccessDenied } = require('../common/errors');
const ChannelHelper = require('../common/channel');

module.exports = {
  type: 'messages:load',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      parentId: Joi.string().optional().allow(null).allow('').default(null),
      pinned: Joi.string().optional(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      page: Joi.number().optional(),
      pageSize: Joi.number().optional().default(50),
      limit: Joi.number().optional(),
      offset: Joi.number().optional(),
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
      parentId: msg.parentId,
      before: msg.before,
      after: msg.after,
      page: msg.page,
      pageSize: msg.pageSize,
      ...(msg.pinned ? { pinned: msg.pinned } : {}),
    }, { limit: msg.limit, offset: msg.offset, order: msg.after ? 1 : -1 });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({
      count: msgs.length,
      minDate: msgs[0].createdAt,
      maxDate: msgs[msgs.length - 1].createdAt,
    });
  },
};
