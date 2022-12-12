const Joi = require('joi');
const db = require('../../infra/database');
const { AccessDenied } = require('../common/errors');
const channelHelper = require('../common/channel');

module.exports = {
  type: 'search',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      text: Joi.string().required(),
      limit: Joi.number().optional().default(100),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    const { channelId } = msg;

    if (!await channelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    const msgs = await db.message.getAll({
      $text: { $search: msg.text },
      channelId,
      before: msg.before,
    }, { limit: msg.limit });

    msgs.forEach((m) => res.send({ type: 'search', ...m }));
    res.ok({ count: msgs.length });
  },
};
