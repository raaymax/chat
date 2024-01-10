const Joi = require('joi');
const { AccessDenied } = require('../../common/errors');
const channelHelper = require('../../common/channel');

module.exports = {
  type: 'message:pins',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      limit: Joi.number().optional().default(10),
    }),
  },
  handler: async (req, res, {repo}) => {
    const msg = req.body;
    const { channelId } = msg;

    if (!await channelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    const msgs = await repo.message.getAll({
      pinned: true,
      channelId,
      before: msg.before,
      after: msg.after,
    }, { limit: msg.limit });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({ count: msgs.length });
  },
};
